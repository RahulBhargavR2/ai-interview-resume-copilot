from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session


from app.core.logger import logger
from app.core.security import (get_current_user)
from app.db.dependencies import get_db

from app.services.overview_service import(
    get_overview,
    get_performance,
    get_improvements,
    get_strengths,
    get_weakness,
    get_all_sessions
)


from app.schemas.analytics import(
    OverviewResponse,
    PerformanceResponse
)

router = APIRouter(
    prefix='/analytics',
    tags=['Analysis']
)

@router.get('/overview', response_model=OverviewResponse)
def overview(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_overview(current_user.id,db)
    except Exception as e:
        logger.exception('Error at overview')
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get('/performance', response_model=list[PerformanceResponse])
def overview(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_performance(current_user.id,db)
    except Exception as e:
        logger.exception('Error at performance')
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get('/improvements')
def overview(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_improvements(current_user.id,db)
    except Exception as e:
        logger.exception('Error at improvements')
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get('/weakness')
def overview(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_weakness(current_user.id,db)
    except Exception as e:
        logger.exception('Error at overview')
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

        
@router.get('/strengths')
def overview(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_strengths(current_user.id,db)
    except Exception as e:
        logger.exception('Error at strengths')
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get('/sessions')
def get_sessions(
    current_user = Depends(get_current_user),
    db : Session = Depends(get_db)
):
    try:
        return get_all_sessions(current_user.id,db)
    except Exception as e:
        logger.exception('Error at strengths')
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )