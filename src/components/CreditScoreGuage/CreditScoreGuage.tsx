import * as d3 from "d3";
import React from "react";
import './CreditScoreGuage.scss';

export interface IProps {
  id: number;
  score: number;
  min_score: number|300;
  max_score: number|900;
}

export interface IState {
}



interface ChartConfig {

  parent: string;             // parent element id, starts with #
  selector: string;           // selector element id, starts with #
  percentage: number;         // credit score percentage of max_score
  background: string;         // background colour
  foreground: string;         // forground colour
  colour: string;             // call getColour() fn to get colour.
  radius: number;             // radius of the guage
  label: string;              // label of the guage
  score: {
    value: Function;          // fuction to calculate the score from percentage
    selector: string;         // score element CSS selector id
  }

}


class CreditScoreGuage extends React.Component<IProps, IState> {

  ref!: SVGSVGElement;

  componentDidMount() {
    this.drawGauge(this.props.score);
  }

  componentDidUpdate(prevProps: IProps) {
    console.log(prevProps);
    d3.selectAll("svg > *").remove();
    this.drawGauge(this.props.score);
  }


  drawGauge(value: number) {

    const ScoreChart = {
      chart: function (options: ChartConfig) {
        const tau = 2 * Math.PI;

        let arc = d3.arc()
          .innerRadius(options.radius - 10)
          .outerRadius(options.radius)
          .startAngle(0);
        let ring1 = d3.arc()
          .innerRadius(options.radius + 18)
          .outerRadius(options.radius + 20)
          .startAngle(0);
        let ring2 = d3.arc()
          .innerRadius(options.radius - 1)
          .outerRadius(options.radius + 11)
          .startAngle(0);

        d3.select(options.parent)
          .attr("style", "width:" + (options.radius * 2 + 46) + "px; height:" + (options.radius * 2 + 46) + "px")
          ;

        var scoreDiv = d3.select(options.score.selector),
          svg = d3.select(options.selector),
          width = 46 + options.radius * 2,
          height = 46 + options.radius * 2,
          g = svg.append("g")
            .attr("transform",
              "translate(" + ((width / 2)) + "," + ((height / 2)) + ")");

        svg.attr("width", width).attr("height", height);

        let circle = svg.append("circle")
          .style("fill", options.colour)
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", 8);

        // Add the background arc, from 0 to 100%.
        let background = g.append("path")
          .datum({
            endAngle: tau
          })
          .style("fill", options.background)
          .attr("d", arc as any);

        let rbackground2 = g.append("path")
          .datum({
            endAngle: tau
          })
          .style("stroke-opacity", 0.1)
          .style("opacity", 0.1)
          .style("fill", '#ffffff')
          .attr("d", ring2 as any);

        let rbackground1 = g.append("path")
          .datum({
            endAngle: tau
          })
          .style("stroke-opacity", 0.3)
          .style("opacity", 0.3)
          .style("fill", '#ffffff')
          .attr("d", ring1 as any);

        // Add the foreground arc in orange, currently showing 12.7%.
        let foreground = g.append("path")
          .datum({
            endAngle: 0.1 * tau
          })
          .style("fill", options.colour)
          .attr("d", arc as any);

        foreground.transition()
          .duration(2000)
          .attrTween("d", arcTween(options.percentage * tau) as any);

        function arcTween(newAngle: number) {
          return function (d: any) {
            let interpolate = d3.interpolate(d.endAngle, newAngle);
            return function (t: any) {
              d.endAngle = interpolate(t);
              let path = arc(d);
              let curScore = options.score.value(perc * t);
              let score = curScore / 100 * 850;
              scoreDiv.html('' + score);
              let cx = options.radius + Math.sin(d.endAngle) * 0.97 * options.radius;
              let cy = options.radius - Math.cos(d.endAngle) * 0.97 * options.radius;
              circle.attr('cx', cx + 23).attr('cy', cy + 23);
              return path;
            };
          };
        }
      }
    };

    let perc = value / this.props.max_score;

    ScoreChart.chart({
      parent: '#test',
      selector: '#svg-chart-' + this.props.id,
      percentage: perc,
      background: '#09132A',
      foreground: '#26E79A',
      colour: this.getColour(value),
      radius: 100,
      label: 'SCORE',
      score: {
        value: function (p: number) {
          return p * 100
        },
        selector: '#gaugue-score-middle-' + this.props.id
      }
    });

  }

  getColour(value: number) {
    const colours: Array<string> = [
      '0:#dd776e',
      '1:#e0816d',
      '2:#e2886c',
      '3:#e5926b',
      '4:#e79a69',
      '5:#e9a268',
      '6:#ecac67',
      '7:#e6ad61',
      '8:#e9b861',
      '9:#f3c563',
      '10:#f5ce62',
      '11:#e2c965',
      '12:#d4c86a',
      '13:#c4c56d',
      '14:#b0be6e',
      '15:#a4c073',
      '16:#94bd77',
      '17:#84bb7b',
      '18:#73b87e',
      '19:#63b682',
      '20:#57bb8a',
    ];
    var length = colours.length;
    var min = this.props.min_score;
    var max = this.props.max_score;
    let indx = Math.floor(value / ((max - min) / length));

    if (indx < length) {
      return colours[indx].split(":")[1];
    } else {
      return colours[20].split(":")[1];
    }
  }

  render() {
    return (
      <div>
        <div className="score-chart flex-center" id="test">
          <svg id={"svg-chart-" + this.props.id} />
          <div className="score-chart-legend">
            <div id={"gaugue-score-middle-" + this.props.id} style={{ color: this.getColour(this.props.score) }}>0</div>
            <p className="gaugue-score-top">out of {this.props.max_score}</p>
          </div>
        </div>
      </div>
    )
  }

}


export default CreditScoreGuage;