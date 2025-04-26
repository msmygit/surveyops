import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface WordCloudProps {
  data: { [key: string]: number };
  width?: number;
  height?: number;
}

const WordCloud = ({ data, width = 400, height = 300 }: WordCloudProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const layout = d3.layout.cloud()
      .size([width, height])
      .words(Object.entries(data).map(([text, value]) => ({
        text,
        size: value * 10 + 10,
      })))
      .padding(5)
      .rotate(() => (Math.random() - 0.5) * 30)
      .font('Impact')
      .fontSize(d => d.size)
      .on('end', draw);

    layout.start();

    function draw(words: d3.layout.cloud.Word[]) {
      svg.append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Impact')
        .style('fill', (_, i) => d3.schemeCategory10[i % 10])
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text(d => d.text);
    }
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default WordCloud; 