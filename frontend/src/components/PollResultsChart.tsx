import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PollResultsChartProps {
  data: { [key: string]: number };
  width?: number;
  height?: number;
}

const PollResultsChart = ({ data, width = 400, height = 300 }: PollResultsChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(Object.keys(data))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(Object.values(data)) || 0])
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(5))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Responses');

    g.selectAll('.bar')
      .data(Object.entries(data))
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d[0]) || 0)
      .attr('y', d => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d[1]))
      .attr('fill', '#1976d2');
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default PollResultsChart; 