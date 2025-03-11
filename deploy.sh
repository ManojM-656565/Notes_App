#!/bin/bash

# Configurations
AWS_REGION="us-east-1"                  # Your AWS region
INSTANCE_TYPE="t2.micro"                 # EC2 instance type
AMI_ID="ami-0c55b159cbfafe1f0"           # Amazon Linux 2 AMI (change if needed)
KEY_NAME="your-key-pair-name"            # Your AWS key pair (.pem file)
SECURITY_GROUP="your-security-group-id"  # Security Group allowing ports 80 & 5000
INSTANCE_NAME="NotesAppInstance"
GIT_REPO="https://github.com/your-username/your-repo.git"  # Your GitHub repo
DEPLOY_SCRIPT="remote-deploy.sh"
REMOTE_PATH="/home/ubuntu/notes-app"

# Step 1: Check for existing EC2 instance
echo "Checking for existing EC2 instance..."
INSTANCE_ID=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=$INSTANCE_NAME" \
  --query "Reservations[*].Instances[*].InstanceId" --output text)

if [ -z "$INSTANCE_ID" ]; then
  echo "No existing instance found. Creating a new EC2 instance..."
  INSTANCE_ID=$(aws ec2 run-instances \
    --image-id $AMI_ID \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-group-ids $SECURITY_GROUP \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" \
    --query "Instances[0].InstanceId" --output text)

  echo "Instance created: $INSTANCE_ID. Waiting for it to initialize..."
  aws ec2 wait instance-running --instance-ids $INSTANCE_ID
else
  echo "Existing instance found: $INSTANCE_ID"
fi

# Step 3: Get Public IP
INSTANCE_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID \
  --query "Reservations[*].Instances[*].PublicIpAddress" --output text)

echo "EC2 Instance is ready at: $INSTANCE_IP"

# Step 4: SSH into EC2 and Deploy the App
ssh -o StrictHostKeyChecking=no -i "$KEY_NAME.pem" ubuntu@$INSTANCE_IP <<EOF
  sudo apt update -y && sudo apt install -y docker.io docker-compose git
  sudo systemctl start docker
  sudo systemctl enable docker

  if [ ! -d "$REMOTE_PATH" ]; then
    git clone $GIT_REPO $REMOTE_PATH
  else
    cd $REMOTE_PATH
    git pull origin main
  fi

  cd $REMOTE_PATH
  sudo docker-compose up --build -d
  echo "Deployment completed! Access app at http://$INSTANCE_IP"
EOF

echo "Deployment completed! Visit: http://$INSTANCE_IP"
