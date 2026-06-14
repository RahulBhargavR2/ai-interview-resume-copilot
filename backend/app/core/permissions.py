from fastapi import HTTPException,Depends

from app.core.security import get_current_user

def require_role(*allowed_roles):
    def checker(current_user = Depends(get_current_user)):
        print(current_user.role in allowed_roles)
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
            )
        return current_user
    return checker
    