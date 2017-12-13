const imgPath = "res/img/";

function AdviceObj(text, danger, timeout=false) {
    this.text = text;
    this.danger = danger;
    this.timeout = timeout;
    this.isQuestion = false;
}
function QuestionObj(text, ToRun) {
    this.text = text;
    this.ToRun = ToRun;
    this.danger = 1;
    this.timeout = false;
    this.isQuestion = true;
}

HelperVue = new Vue({
    el: "#helper-box",
    data: {
        currentAdvice: {},
        advice: [],
        dangerMap : [`${imgPath}danger-success.png`,`${imgPath}danger-warn.png`,`${imgPath}danger-high.png`],
        timeoutInst: {}
    },
    methods: {
        DismissCurrentAdvice() {
            this.advice.splice(0, 1);
            if (this.hasAdvice) {
                this.currentAdvice = this.advice[0];
            }
        },
        QueueAdvice(adviceObj) {
            if (this.timeoutInst != null) { // Clear timeout, if there was one. Prevents issues with timeout closing different advice then intended.
                window.clearInterval(this.timeoutInst);
                this.timeoutInst = null;
            }

            this.advice.splice(this.advice.length, 0, adviceObj); // Add advice to main array

            if (this.advice.length == 1) { // If there wasn't any advice showing, show top.
                this.currentAdvice = this.advice[0];
            }

            if (adviceObj.timeout == true) { // Add timeout, if applicable.
                console.log("run")
                this.timeoutInst = window.setInterval(function() {
                    HelperVue.DismissCurrentAdvice();
                    window.clearInterval(HelperVue.timeoutInst);
                    this.timeoutInst = null;
                    console.log("run");
                }, 3000)
            }
        },
        QueueQuestion(questionObj) { // Here for semantic reasons. Acutal difference handled by object.
            this.QueueAdvice(questionObj);
        },
        ConfirmCurrentQuestion() {
            this.currentAdvice.ToRun();
            this.DismissCurrentAdvice();
        }
    },
    computed: {
        hasAdvice() {
            return this.advice.length != 0;
        }
    }
});