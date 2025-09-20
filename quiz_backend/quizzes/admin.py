from django.contrib import admin
from .models import Quiz, Question, Option, QuizAttempt, UserAnswer


class OptionInline(admin.TabularInline):
    model = Option
    extra = 2


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "difficulty", "is_published", "start_time", "end_time", "created_by", "created_at")
    list_filter = ("category", "difficulty", "is_published", "created_at")
    search_fields = ("title", "description", "category", "created_by__username")
    inlines = [QuestionInline]
    ordering = ("-created_at",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("text", "quiz", "question_type", "marks")
    list_filter = ("question_type", "quiz")
    search_fields = ("text", "quiz__title")
    inlines = [OptionInline]


@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ("text", "question", "is_correct")
    list_filter = ("is_correct", "question__quiz")
    search_fields = ("text", "question__text")


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ("user", "quiz", "attempt_number", "score", "negative_marks", "is_passed", "is_completed", "started_at", "completed_at")
    list_filter = ("quiz", "is_completed", "is_passed")
    search_fields = ("user__username", "quiz__title")


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ("attempt", "question_display", "selected_options_display")
    search_fields = ("attempt__user__username", "question__text")

    def question_display(self, obj):
        return obj.question.text[:50]
    question_display.short_description = "Question"

    def selected_options_display(self, obj):
        return ", ".join([opt.text for opt in obj.selected_options.all()])
    selected_options_display.short_description = "Selected Options"
