from rest_framework import serializers
from quizzes.models import QuizAttempt


class UserAttemptReportSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='quiz.title', read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ["id", "title", "score", "negative_marks", "is_passed", "started_at", "completed_at"]


class QuizPerformanceSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
    quiz_title = serializers.CharField()
    avg_score = serializers.FloatField()
    success_rate = serializers.FloatField()
    total_attempts = serializers.IntegerField()
    total_passed = serializers.IntegerField()


class UserPerformanceSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    total_attempts = serializers.IntegerField()
    passed_count = serializers.IntegerField()
    failed_count = serializers.IntegerField()