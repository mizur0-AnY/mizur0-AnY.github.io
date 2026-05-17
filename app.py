from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html", title="Главная")


@app.route("/types")
def types():
    return render_template("types.html", title="Типы роботов")


@app.route("/applications")
def applications():
    return render_template("applications.html", title="Применение")


@app.route("/basics")
def basics():
    return render_template("basics.html", title="Основы")


@app.route("/interactive", methods=["GET", "POST"])
def interactive():
    result = None
    if request.method == "POST":
        name = (request.form.get("name") or "").strip() or "Гость"
        focus = request.form.get("focus") or "general"
        level = request.form.get("level") or "beginner"
        labels = {
            "manipulators": "манипуляторы и промышленная автоматизация",
            "mobile": "мобильные и автономные роботы",
            "humanoid": "гуманоидные и сервисные системы",
            "research": "исследовательские платформы и ИИ",
            "general": "робототехнику в целом",
        }
        levels = {
            "beginner": "с нуля, шаг за шагом",
            "school": "в рамках школьного или кружкового уровня",
            "hobby": "как увлечение с практикой на макетах",
            "pro": "на уровне инженерных задач и прототипов",
        }
        result = {
            "greeting": f"Привет, {name}!",
            "path": (
                f"Для изучения {labels.get(focus, labels['general'])} "
                f"логично двигаться {levels.get(level, levels['beginner'])}: "
                "начните с простых схем и датчиков, затем добавляйте "
                "управление и обратную связь."
            ),
        }
    return render_template("interactive.html", title="Интерактив", result=result)


@app.route("/api/quiz-check", methods=["POST"])
def quiz_check():
    """Проверка ответа викторины с сервера (демонстрация Python в цепочке)."""
    data = request.get_json(silent=True) or {}
    qid = str(data.get("q"))
    choice = str(data.get("choice", "")).strip().lower()
    answers = {
        "1": "b",
        "2": "a",
        "3": "c",
    }
    correct = answers.get(qid) == choice
    messages = {
        ("1", True): "Верно: сервопривод задаёт угол по сигналу управления.",
        ("1", False): "Подсказка: речь про точное позиционирование по команде.",
        ("2", True): "Верно: лидыар даёт облако точек и дальности.",
        ("2", False): "Подсказка: активное зондирование лазером.",
        ("3", True): "Верно: PID — классика для плавного следования за целью.",
        ("3", False): "Подсказка: три компонента: P, I и D.",
    }
    msg = messages.get((qid, correct), "Ответ принят.")
    return jsonify({"correct": correct, "message": msg})


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
