from rest_framework import serializers
from quizzes.models import Quiz, Question, Option


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id","question", "text", "image", "is_correct"]
        read_only_fields = ("question",)


class QuizOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id","question", "text", "image", "is_correct"]
    
    
class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, required=False)

    class Meta:
        model = Question
        fields = ["id", "text", "image", "question_type", "marks", "quiz", "options"]
        read_only_fields = ("quiz",)

    def create(self, validated_data):
        options_data = validated_data.pop("options", [])
        quiz_id = self.context.get("quiz_id")
        
        if not quiz_id:
            raise serializers.ValidationError({"quiz": "Quiz ID is required in context."})

        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            raise serializers.ValidationError({"quiz": f"Quiz with id={quiz_id} does not exist."})

        question = Question.objects.create(quiz=quiz, **validated_data)

        for option in options_data:
            Option.objects.create(question=question, **option)

        return question
    
    def update(self, instance, validated_data):
        option_data = validated_data.pop("options", [])
        instance.text = validated_data.get("text", instance.text)
        instance.image = validated_data.get("image", instance.image)
        instance.question_type = validated_data.get("question_type", instance.question_type)
        instance.marks = validated_data.get("marks", instance.marks)
        instance.save()

        if option_data:
            instance.options.all().delete()
            for option in option_data:
                Option.objects.create(question=instance, **option)

        return instance


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False)
    
    class Meta:
        model = Quiz
        fields = [
            "id", "title", "description", "category", "start_time", "end_time",
            "time_limit", "is_published", "created_at", "updated_at",
            "total_questions", "passing_score", "max_attempts",
            "negative_marking", "negative_marks_per_question",
            "shuffle_questions", "shuffle_options",
            "show_answers_post_quiz", "show_score_post_quiz",
            "allow_back_navigation", "difficulty",
            "created_by", "questions"
        ]
        read_only_fields = ("created_by", "created_at", "updated_at")

    def create(self, validated_data):
        request = self.context.get("request")
        question_data = validated_data.pop("questions", [])
        quiz = Quiz.objects.create(created_by=request.user, **validated_data)

        for question in question_data:
            option_data = question.pop("options", [])
            questions = Question.objects.create(quiz=quiz, **question)
            for option in option_data:
                Option.objects.create(question=questions, **option)

        quiz.total_questions = quiz.questions.count()
        quiz.save()
        return quiz