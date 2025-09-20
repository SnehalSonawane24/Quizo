from django.db import models
from users.models import CustomUser


class Quiz(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    time_limit = models.IntegerField(help_text="Time limit in minutes", null=True, blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_questions = models.IntegerField(default=0)
    passing_score = models.IntegerField(default=0)
    max_attempts = models.IntegerField(default=1)
    negative_marking = models.BooleanField(default=False)
    negative_marks_per_question = models.FloatField(default=0.0)
    shuffle_questions = models.BooleanField(default=False)
    shuffle_options = models.BooleanField(default=False)
    show_answers_post_quiz = models.BooleanField(default=False)
    show_score_post_quiz = models.BooleanField(default=True)
    allow_back_navigation = models.BooleanField(default=True)
    difficulty = models.CharField(
        max_length=20,
        choices=(('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')),
        default='medium'
    )

    # FK's
    created_by = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="quizzes"
    )

    def __str__(self):
        return f"{self.title} {self.category}"
    

class Question(models.Model):
    text = models.TextField()
    image = models.ImageField(upload_to="quiz/questions/", blank=True, null=True)
    question_type = models.CharField(
        max_length=20,
        choices=(('mcq', "Multiple Choice"),
                 ('tf', "True/False")),
                 default='mcq'
        )
    marks = models.IntegerField(default=1)

    # FK's
    quiz = models.ForeignKey(
        Quiz, on_delete=models.CASCADE, related_name="questions"
    )

    def __str__(self):
        return f"{self.text} if {self.text} else {self.id}"
    

class Option(models.Model):
    text = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to="options/", blank=True, null=True)
    is_correct = models.BooleanField(default=False)

    # FK's 
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="options"
    )

    def __str__(self):
        return f"{self.text} if {self.text} else {self.id}"
    

class QuizAttempt(models.Model):
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    attempt_number = models.PositiveIntegerField(default=1)
    score = models.IntegerField(default=0)
    negative_marks = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    is_passed = models.BooleanField(default=False)

    # FK's 
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="user_attempts"
    )
    quiz = models.ForeignKey(
        Quiz, on_delete=models.CASCADE, related_name="attempts"
    )

    def __str__(self):
        return f"{self.user.username} {self.quiz.title} {self.attempt_number}"
    

class UserAnswer(models.Model):
    # FK's
    attempt = models.ForeignKey(
        QuizAttempt, on_delete=models.CASCADE, related_name="answers"
    )
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_options = models.ManyToManyField(Option, blank=True)

    def __str__(self):
        return f"{self.attempt.user.username} {self.question.text[:30]}"