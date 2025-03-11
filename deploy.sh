


#!/bin/bash

# AWS Configuration
AWS_REGION="us-east-1"   # Change this to your AWS region
INSTANCE_TYPE="t2.micro"
AMI_ID="ami-00cef6eb8e65487cc"  # Replace with the correct AMI ID for your region
KEY_NAME="NotesAppKey"   # This must match the name of your key pair in AWS
INSTANCE_NAME="NotesAppInstance"
SECURITY_GROUP="sg-015895cddcc330457"  # Replace with your security group ID
GIT_REPO="https://github.com/ManojM-656565/Notes_App.git"

# Find existing EC2 instance
INSTANCE_ID=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=$INSTANCE_NAME" --query "Reservations[*].Instances[*].InstanceId" --output text)

if [ -z "$INSTANCE_ID" ]; then
    echo "No existing EC2 instance found. Creating a new one..."

    INSTANCE_ID=$(aws ec2 run-instances \
        --image-id $AMI_ID \
        --instance-type $INSTANCE_TYPE \
        --key-name $KEY_NAME \
        --security-group-ids $SECURITY_GROUP \
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" \
        --query "Instances[0].InstanceId" --output text)

    echo "Waiting for EC2 instance to initialize..."
    sleep 30
fi

# Get EC2 Public IP
EC2_PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[*].Instances[*].PublicIpAddress" --output text)

echo "EC2 instance is running at: $EC2_PUBLIC_IP"

# Move the SSH key to ~/.ssh if not already there
if [ ! -f ~/.ssh/$KEY_NAME.pem ]; then
    echo "Moving SSH key to ~/.ssh/"
    mkdir -p ~/.ssh
    mv $KEY_NAME.pem ~/.ssh/
    chmod 400 ~/.ssh/$KEY_NAME.pem
fi

# Connect to EC2 & Deploy the App
ssh -o StrictHostKeyChecking=no -i ~/.ssh/$KEY_NAME.pem ubuntu@$EC2_PUBLIC_IP << EOF

# Update system and install dependencies
sudo apt update -y && sudo apt install -y docker docker-compose git

# Clone the repository (if not already cloned)
if [ ! -d "NotesApp" ]; then
    git clone $GIT_REPO NotesApp
fi

cd NotesApp

# Pull the latest code
git pull origin main

# Update frontend .env file with backend URL
echo "VITE_BACKEND_URL=http://$EC2_PUBLIC_IP:5000" > frontend/.env

# Build and start the app using Docker Compose
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d

EOF

echo "🚀 Deployment successful! Access your app at: http://$EC2_PUBLIC_IP"

