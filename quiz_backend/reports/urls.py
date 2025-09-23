from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reports.views import UserReportViewSet, AdminReportViewSet


router = DefaultRouter()
router.register(r'user/reports', UserReportViewSet, basename="user-report")
router.register(r'admin/reports', AdminReportViewSet, basename="admin-report")

urlpatterns = [
    path('', include(router.urls))
]