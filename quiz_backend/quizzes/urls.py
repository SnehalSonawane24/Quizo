from django.urls import path, include
from rest_framework.routers import DefaultRouter
from quizzes.views import QuizViewSet, QuestionViewSet, OptionViewSet, UserQuizViewSet

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet, basename="quiz")
router.register(r'questions', QuestionViewSet, basename="question")
router.register(r'options', OptionViewSet, basename="option")

user_quiz_router = DefaultRouter()
user_quiz_router.register(r'user/quizzes', UserQuizViewSet, basename="user-quiz")

urlpatterns = [
    path('', include(router.urls)),
    path('', include(user_quiz_router.urls)),
]