from rest_framework import viewsets
from rest_framework.decorators import action
from django.db.models import Avg
from quizzes.models import QuizAttempt, Quiz
from reports.serializers import UserAttemptReportSerializer, QuizPerformanceSerializer, UserPerformanceSerializer
from users.utility import custom_response
from users.models import CustomUser


class UserReportViewSet(viewsets.ViewSet):

    @action(detail=False, methods=["GET"])
    def attempts(self, request):
        if request.user.is_authenticated:
            user_attempts = QuizAttempt.objects.filter(user=request.user)
            serializer = UserAttemptReportSerializer(user_attempts, many=True)
            return custom_response(
                success=True,
                message="User quiz attempts fetched successfully",
                data=serializer.data,
                status_code=200
            )
    
    @action(detail=False, methods=["GET"])
    def progress(self, request):
        if request.user.is_authenticated:
            total_quizzes = Quiz.objects.filter(is_published=True).count()
            attempted_quizzes = QuizAttempt.objects.filter(user=request.user).values("quiz").distinct().count()
            progress_percentage = (attempted_quizzes/total_quizzes)*100 if total_quizzes else 0
            return custom_response(
                success=True,
                message="User progress fetched successfully",
                data={
                    "total_quizzes": total_quizzes,
                    "attempted_quizzes": attempted_quizzes,
                    "progress_percentage": progress_percentage
                },
                status_code=200
            )


class AdminReportViewSet(viewsets.ViewSet):

    @action(detail=False, methods=["GET"])
    def quiz_performance(self, request):
        if request.user.is_authenticated and request.user.role == "admin":
            quizzes = Quiz.objects.all()
            data = []
            for quiz in quizzes:
                attempts = QuizAttempt.objects.filter(quiz=quiz)
                total_attempts = attempts.count()
                total_passed = attempts.filter(is_passed=True).count()
                avg_score = attempts.aggregate(Avg("score"))["score__avg"] or 0
                success_rate = (total_passed / total_attempts * 100) if total_attempts else 0
                data.append({
                    "quiz_id": quiz.id,
                    "quiz_title": quiz.title,
                    "avg_score": avg_score,
                    "success_rate": success_rate,
                    "total_attempts": total_attempts,
                    "total_passed": total_passed
                })
            serializer = QuizPerformanceSerializer(data, many=True)
            return custom_response(
                success=True,
                message="Quiz performance data fetched successfully",
                data=serializer.data,
                status_code=200
            )
        return custom_response(
            success=False,
            message="Unauthorized access",
            data={},
            status_code=403
        )

    @action(detail=False, methods=["GET"])
    def user_performance(self, request):
        if request.user.is_authenticated and request.user.role == "admin":
            users = CustomUser.objects.all()
            data = []
            for user in users:
                attempts = QuizAttempt.objects.filter(user=user)
                total_attempts = attempts.count()
                passed_count = attempts.filter(is_passed=True).count()
                failed_count = total_attempts - passed_count
                data.append({
                    "user_id": user.id,
                    "username": user.username,
                    "total_attempts": total_attempts,
                    "passed_count": passed_count,
                    "failed_count": failed_count
                })
            serializer = UserPerformanceSerializer(data, many=True)
            return custom_response(
                success=True,
                message="User performance data fetched successfully",
                data=serializer.data,
                status_code=200
            )
        return custom_response(
            success=False,
            message="Unauthorized access",
            data={},
            status_code=403
        )