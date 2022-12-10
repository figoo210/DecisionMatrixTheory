import json
from flask import Flask, render_template, request

from helpers import maximax, maximin, equally_likely, criterion_of_realism, decision_matrix_calc

app = Flask(__name__)


@app.route('/')
def hello():
    return render_template('index.html')


@app.route('/decision-matrix', methods=('GET', 'POST'))
def decision_matrix():
    if request.method == "POST":
        full_matrix = json.loads(request.form.get("data"))
        weights_list = json.loads(request.form.get("weights"))
        weights = [eval(x) for x in weights_list]
        pure_matrix = []
        for i in full_matrix:
            row = [eval(x) for x in i]
            pure_matrix.append(row)
        result, idx = decision_matrix_calc(pure_matrix, weights)
        print(result)
        print(idx)
        return {"result": str(result), "idx": str(idx)}
    return render_template('decision_matrix.html')


@app.route('/matrix', methods=('GET', 'POST'))
def matrix():
    if request.method == "POST":
        mode = request.form.get("mode")
        alpha = request.form.get("alpha")
        full_matrix = json.loads(request.form.get("data"))
        pure_matrix = []
        for i in full_matrix:
            row = [eval(x) for x in i]
            pure_matrix.append(row)

        result = None
        idx = None
        if mode == "Maximax":
            result, idx = maximax(pure_matrix)
        elif mode == "Maximin":
            result, idx = maximin(pure_matrix)
        elif mode == "Criterion of Realism":
            print(alpha)
            if not alpha:
                result = "Please Provide Alpha to calculate Criterion of Realism!"
            else:
                result, idx = criterion_of_realism(pure_matrix, eval(alpha))
        elif mode == "Equally likely":
            result, idx = equally_likely(pure_matrix)

        return {"result": result, "mode": mode, "idx": idx}
    return render_template('matrix.html')


@app.route('/favicon.ico')
def favicon():
    return "Done"


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
