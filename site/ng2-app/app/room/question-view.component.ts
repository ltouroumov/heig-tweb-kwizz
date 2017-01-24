import {Component, Input, OnInit, OnDestroy} from "@angular/core";
import {Question} from "./question";
import {Option} from "./option";
import {Subscription, BehaviorSubject} from "rxjs";
import * as _ from "underscore";

@Component({
    selector: 'question-view',
    templateUrl: './question-view.component.html',
    host: { 'class': 'question row' }
})
export class QuestionViewComponent implements OnInit, OnDestroy {

    @Input()
    private question: Question;

    private optSub: Subscription;

    private total: BehaviorSubject<number> = new BehaviorSubject(0);

    private chartData: Array<number> = [];

    private chartLabels: Array<string> = [];

    private showDetails: boolean = true;

    public optionId(idx: number, item: Option) {
        return item.id;
    }

    public getWidth(votes: number, total: number) {
        if (total != 0) {
            let width = (votes / total) * 100.0;
            return `${width}%`;
        } else {
            return `0%`;
        }
    }

    public ngOnInit() {
        this.optSub = this.question.options
            .subscribe(options => {
                this.updateChartData(options);
            });
    }

    public ngOnDestroy() {
        this.optSub.unsubscribe();
    }

    private updateChartData(options: Option[]) {
        let data = _.unzip(
            _.map(
                _.sortBy(options, option => option.id),
                option => [option.title, option.votes.getValue()]
            )
        );

        console.log("Chart Data", data);

        this.chartLabels = data[0];
        this.chartData = data[1];
        this.total.next(_.reduce(data[1], (acc: number, n: number) => acc + n, 0));
    }

}