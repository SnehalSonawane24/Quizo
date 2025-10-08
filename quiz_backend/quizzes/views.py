from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.utils import timezone
from quizzes.models import Quiz
from quizzes.serializers import QuizSerializer, QuestionSerializer, QuizOptionSerializer, QuizDetailSerializer, QuizAttemptSerilizer, SubmitAnswserSerializer
from quizzes.models import Question, Option, QuizAttempt, UserAnswer
from users.utility import custom_response


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all().order_by('-created_at')
    serializer_class = QuizSerializer
    
    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.role == "admin":
            serializer = self.get_serializer(data=request.data, context={"request": request})
            if serializer.is_valid():
                quiz = serializer.save()
                return custom_response(
                    success=True,
                    message="Quiz created successfully",
                    data=self.get_serializer(quiz).data,
                    status_code=status.HTTP_201_CREATED,
                )
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.role == "admin":
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            if serializer.is_valid():
                quiz = serializer.save()
                return custom_response(
                    success=True,
                    message="Quiz updated successfully",
                    data=self.get_serializer(quiz).data,
                    status_code=status.HTTP_200_OK,
                )
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def destroy(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.role == "admin":
            instance = self.get_object()
            instance.delete()
            return custom_response(
                success=True,
                message="Quiz deleted successfully",
                data={},
                status_code=status.HTTP_204_NO_CONTENT,
            )
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if not (request.user.is_authenticated and getattr(request.user, "role", None) == "admin"):
            queryset = queryset.filter(is_published=True)

        serializer = self.get_serializer(queryset, many=True)
        return custom_response(
            success=True,
            message="Quiz list retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )
    
    def retrieve(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.role == "admin":
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return custom_response(
                success=True,
                message="Quiz details retrieved successfully",
                data=serializer.data,
                status_code=status.HTTP_200_OK,
            )


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
   
    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.role == "admin":
             quiz_id = request.data.get("quiz")
        if not quiz_id:
            return Response({"quiz": "This field is required."}, status=400)

        serializer = self.get_serializer(
            data=request.data,
            context={"quiz_id": quiz_id}
        )
        serializer.is_valid(raise_exception=True)
        question = serializer.save()
        return Response(self.get_serializer(question).data, status=201)
    
    def update(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.role == "admin":
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
            if serializer.is_valid():
                question = serializer.save()
                return custom_response(
                    success=True,
                    message="Question updated successfully",
                    data=self.get_serializer(question).data,
                    status_code=status.HTTP_200_OK,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.role == "admin":
            instance = self.get_object()
            instance.delete()
            return custom_response(
                success=True,
                message="Question deleted successfully",
                data={},
                status_code=status.HTTP_204_NO_CONTENT,
            )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return custom_response(
            success=True,
            message="Question list retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return custom_response(
            success=True,
            message="Question details retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )


class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = QuizOptionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        option = serializer.save()
        return custom_response(
            success=True,
            message="Option created successfully",
            data=self.get_serializer(option).data,
            status_code=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.role == "admin":
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
            if serializer.is_valid():
                option = serializer.save()
                return custom_response(
                    success=True,
                    message="Option updated successfully",
                    data=self.get_serializer(option).data,
                    status_code=status.HTTP_200_OK,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.role == "admin":
            instance = self.get_object()
            instance.delete()
            return custom_response(
                success=True,
                message="Option deleted successfully",
                data={},
                status_code=status.HTTP_204_NO_CONTENT,
            )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return custom_response(
            success=True,
            message="Option list retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return custom_response(
            success=True,
            message="Option details retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )
    

class UserQuizViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self,request):
        now = timezone.now()
        quizzes = Quiz.objects.filter(is_published=True, start_time__lte=now, end_time__gte=now)
        serializer = QuizDetailSerializer(quizzes, many=True)
        return custom_response(
            success=True,
            message="Active quizzes retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )
    
    def retrieve(self, request, pk=None):
        quiz = Quiz.objects.filter(pk=pk, is_published=True).first()
        if not quiz:
            return Response({"error": "Quiz not found"}, status=404)
        
        serializer = QuizDetailSerializer(quiz)
        return custom_response(
            success=True,
            message="Quiz details retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )
    
    @action(detail=True, methods=["POST"])
    def start_attempt(self, request, pk=None):
        quiz = Quiz.objects.filter(pk=pk, is_published=True).first()
        if not quiz:
            return Response({"error": "Quiz not found"}, status=404)
        attempt = QuizAttempt.objects.create(user=request.user, quiz=quiz, attempt_number= QuizAttempt.objects.filter(user=request.user, quiz=quiz).count() + 1)
        serializer = QuizAttemptSerilizer(attempt)
        return custom_response(
            success=True,
            message="Quiz attempt started successfully",
            data=serializer.data,
            status_code=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["POST"])
    def submit_answer(self, request, pk=None):
        attempt = QuizAttempt.objects.filter(pk=pk, user=request.user, is_completed=False).first()
        if not attempt:
            return Response({"error": "No active attempt found"}, status=404)
        
        serializer = SubmitAnswserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = Question.objects.get(id=serializer.validated_data['question'])
        selected_option_ids = serializer.validated_data.get("selected_options", [])
        options = Option.objects.filter(id__in=selected_option_ids, question=question)

        user_answer, _ = UserAnswer.objects.get_or_create(attempt=attempt, question=question)
        user_answer.selected_options.set(options)

        return custom_response(
            success=True,
            message="Answer submitted successfully",
            data={},
            status_code=status.HTTP_200_OK,
        )
    
    @action(detail=True, methods=["POST"])
    def finish_attempt(self, request, pk=None):
        attempt = QuizAttempt.objects.filter(pk=pk, user=request.user, is_completed=False).first()
        if not attempt:
            return Response({"error": "Attempt not found or already finished"}, status=404)

        score = 0
        negative_marks = 0
        for answer in attempt.answers.all():
            correct_options = set(answer.question.options.filter(is_correct=True).values_list("id", flat=True))
            selected_ids = set(answer.selected_options.values_list("id", flat=True))
            if selected_ids == correct_options:
                score += answer.question.marks
            else:
                negative_marks += getattr(answer.question, "negative_marks", 0)

        attempt.score = score
        attempt.negative_marks = negative_marks
        attempt.is_passed = score >= getattr(attempt.quiz, "passing_score", 0)
        attempt.is_completed = True
        attempt.completed_at = timezone.now()
        attempt.save()

        serializer = QuizAttemptSerilizer(attempt)
        return Response({"success": True, "data": serializer.data})

    @action(detail=True, methods=["GET"])
    def attempt_details(self, request, pk=None):
        """
        GET /api/quizzes/user/quizzes/<attempt_id>/attempt_details/
        Fetch a quiz attempt by its ID (finished or ongoing)
        """
        attempt = QuizAttempt.objects.filter(pk=pk, user=request.user).first()
        if not attempt:
            return Response({"error": "Attempt not found"}, status=404)
        
        serializer = QuizAttemptSerilizer(attempt)
        return custom_response(
            success=True,
            message="Quiz attempt details retrieved successfully",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )