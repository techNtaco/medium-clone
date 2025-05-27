const ProfileDropdown = () => {
  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-10">
      <div className="px-4 py-2 border-b text-sm text-gray-600">John Doe</div>
      <div
        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </div>
    </div>
  )
}

export default ProfileDropdown