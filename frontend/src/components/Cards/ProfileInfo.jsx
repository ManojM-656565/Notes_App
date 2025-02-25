/* eslint-disable react/prop-types */
import { getInitials } from "../../utils/helper"

const ProfileInfo = ({userInfo,onLogOut}) => {
  console.log(userInfo);
  if (!userInfo) {
    return <p>Loading user info...</p>;
}
  return (
    <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
            {getInitials(userInfo.fullname)}
        </div>
        <div>
            <p className="text-sm font-medium">{userInfo.fullname}</p>
            <button className="text-sm text-slate-700 underline"
            onClick={onLogOut}
            >
                LogOut
            </button>
        </div>
    </div>
  )
}

export default ProfileInfo