import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { WordCloudSlide as WordCloudSlideType, Slide } from '../../types';
import { BaseSlide } from './BaseSlide';

interface WordCloudSlideProps {
  slide: Slide;
  isAdmin?: boolean;
  onUpdate?: (slide: Slide) => void;
  onSubmit: (response: { word: string }) => void;
}

export function WordCloudSlide({ slide, isAdmin, onUpdate, onSubmit }: WordCloudSlideProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [inputWord, setInputWord] = useState('');

  useEffect(() => {
    if (isAdmin && svgRef.current) {
      drawWordCloud();
    }
  }, [slide.words, isAdmin]);

  const drawWordCloud = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 400;

    const layout = d3.layout.cloud()
      .size([width, height])
      .words(slide.words.map(d => ({ text: d.text, size: d.size })))
      .padding(5)
      .rotate(() => Math.random() * 2 - 1)
      .fontSize(d => d.size)
      .on('end', draw);

    layout.start();

    function draw(words: any[]) {
      svg.append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Impact')
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text(d => d.text)
        .attr('fill', () => d3.schemeCategory10[Math.floor(Math.random() * 10)]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputWord.trim()) {
      onSubmit({ word: inputWord.trim() });
      setInputWord('');
    }
  };

  return (
    <BaseSlide slide={slide} isAdmin={isAdmin} onUpdate={onUpdate}>
      <div className="slide-content">
        <p className="mb-4">{slide.prompt}</p>
        
        {isAdmin ? (
          <div className="mb-4">
            <svg ref={svgRef} width={600} height={400}></svg>
          </div>
        ) : (
          <div className="mb-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={inputWord}
                  onChange={(e) => setInputWord(e.target.value)}
                  placeholder="Enter your word"
                  maxLength={50}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!inputWord.trim()}
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </BaseSlide>
  );
} 