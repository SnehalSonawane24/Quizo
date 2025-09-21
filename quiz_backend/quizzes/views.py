from rest_framework import viewsets, status
from rest_framework.response import Response
from quizzes.models import Quiz
from quizzes.serializers import QuizSerializer, QuestionSerializer, QuizOptionSerializer
from quizzes.models import Question, Option
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