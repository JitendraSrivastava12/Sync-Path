import React from 'react';
import { useParams } from 'react-router-dom';
import componentMap from '../components/generatedMap';

export default function AlgorithmVisualizer(props) {
  const params = useParams();
  const algorithmId = props.algorithmId || params.algorithmId;

  const Comp = componentMap[algorithmId];
  return (
    <div className="w-full">
      {Comp ? <Comp algorithmId={algorithmId} /> : <div className="text-center text-gray-400">No visualizer found for &quot;{algorithmId}&quot;.</div>}
    </div>
  );
}
