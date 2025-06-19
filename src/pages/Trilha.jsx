import React, { useCallback } from 'react'
import ReactFlow, {
  Handle,
  Position,
  Controls,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'

const size = 64
const strokeWidth = 6
const totalXp = 100
const gainedXp = 20
const percent = gainedXp / totalXp
const radius = (size - strokeWidth) / 2
const circumference = 2 * Math.PI * radius
const offset = circumference * (1 - percent)

const verticalGap = 140
const mainX = 300
const leftX = 50
const rightX = 550

const mainStyle = {
  width: 200,      
  padding: 10,
  background: '#111',
  color: '#fff',
  borderRadius: 8,
  textAlign: 'center',
}
const lateralStyle = {
  width: 200,      
  padding: 8,
  background: '#fff',
  color: '#0e0e0ee5',
  borderRadius: 6,
  textAlign: 'center',
}

const CustomNode = ({ data }) => {
  const style = data.isMain ? mainStyle : lateralStyle
  return (
    <div style={{ position:'relative', ...style }}>
      {data.handles.map(h => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type}
          position={h.position}
          style={h.style}
        />
      ))}
      <div style={{ whiteSpace:'pre-wrap' }} className="flex items-center justify-between">
        <span className={`h-8 w-8 min-w-8 rounded-full mr-2 ${
          data.done ? 'bg-green-500' : 'bg-gray-500'
        }`} />
        <div className="flex-1 flex justify-center font-semibold">
            <div className="whitespace-pre-wrap text-center">
                {data.label}
            </div>
        </div>
      </div>
    </div>
  )
}

const nodeTypes = { custom: CustomNode }

const nodesInit = [
  {
    id: 'n1', type: 'custom',
    position: { x: mainX, y: verticalGap * 1 },
    data: {
      label: 'Versionamento\n 10/10 xp',
      isMain: true, done: false,
      handles: [
        { id: 'n1-b', type: 'source', position: Position.Bottom },
        { id: 'n1-r', type: 'source', position: Position.Right },
      ],
    },
  },
  {
    id: 'n2', type: 'custom',
    position: { x: mainX, y: verticalGap * 2 },
    data: {
      label: 'Operações básicas\n10/10 xp',
      isMain: true, done: false,
      handles: [
        { id: 'n2-t', type: 'target', position: Position.Top },
        { id: 'n2-b', type: 'source', position: Position.Bottom },
        { id: 'n2-l1', type: 'source', position: Position.Left, style: { top: '35%' } },
        { id: 'n2-l2', type: 'source', position: Position.Left, style: { top: '65%' } },
      ],
    },
  },
  {
    id: 'n3', type: 'custom',
    position: { x: mainX, y: verticalGap * 3 },
    data: {
      label: 'Fluxo de controle\n0/10 xp',
      isMain: true, done: false,
      handles: [
        { id: 'n3-t', type: 'target', position: Position.Top },
        { id: 'n3-r1', type: 'source', position: Position.Right, style: { top: '35%' } },
        { id: 'n3-r2', type: 'source', position: Position.Right, style: { top: '65%' } },
      ],
    },
  },

  {
    id: 'm1', type: 'custom',
    position: { x: leftX, y: verticalGap*2 - 50 },
    data: {
      label: 'Operadores aritméticos\n5 xp',
      isMain: false, done: false,
      handles: [{ id: 'm1-r', type: 'target', position: Position.Right }],
    },
  },
  {
    id: 'm2', type: 'custom',
    position: { x: leftX, y: verticalGap*2 + 50 },
    data: {
      label: 'Operadores lógicos\n5 xp',
      isMain: false, done: false,
      handles: [{ id: 'm2-r', type: 'target', position: Position.Right }],
    },
  },

  {
    id: 'm3', type: 'custom',
    position: { x: rightX, y: verticalGap*1 },
    data: {
      label: 'Git\n 5 xp',
      isMain: false, done: false,
      handles: [{ id: 'm3-l', type: 'target', position: Position.Left }],
    },
  },
  {
    id: 'm4', type: 'custom',
    position: { x: rightX, y: verticalGap*3 - 50 },
    data: {
      label: 'If-Else/Switch\n 5 xp',
      isMain: false, done: false,
      handles: [{ id: 'm4-l', type: 'target', position: Position.Left }],
    },
  },
  {
    id: 'm5', type: 'custom',
    position: { x: rightX, y: verticalGap*3 + 50 },
    data: {
      label: 'For/While/Do-While\n5 xp',
      isMain: false, done: false,
      handles: [{ id: 'm5-l', type: 'target', position: Position.Left }],
    },
  },
]

const edgesInit = [
  { id:'e1-2', source:'n1', sourceHandle:'n1-b', target:'n2', targetHandle:'n2-t', style:{stroke:'#888'} },
  { id:'e2-3', source:'n2', sourceHandle:'n2-b', target:'n3', targetHandle:'n3-t', style:{stroke:'#888'} },
  { id:'e2-m1', source:'n2', sourceHandle:'n2-l1', target:'m1', targetHandle:'m1-r', style:{strokeDasharray:'4 2', stroke:'#888'} },
  { id:'e2-m2', source:'n2', sourceHandle:'n2-l2', target:'m2', targetHandle:'m2-r', style:{strokeDasharray:'4 2', stroke:'#888'} },
  { id:'e1-m3', source:'n1', sourceHandle:'n1-r', target:'m3', targetHandle:'m3-l', style:{strokeDasharray:'4 2', stroke:'#888'} },
  { id:'e3-m4', source:'n3', sourceHandle:'n3-r1', target:'m4', targetHandle:'m4-l', style:{strokeDasharray:'4 2', stroke:'#888'} },
  { id:'e3-m5', source:'n3', sourceHandle:'n3-r2', target:'m5', targetHandle:'m5-l', style:{strokeDasharray:'4 2', stroke:'#888'} },
]
export default function Trilha() {
    const [nodes, setNodes, onNodesChange] = useNodesState(nodesInit)
    const [edges, , onEdgesChange] = useEdgesState(edgesInit)
    const [started, setStarted] = React.useState(false)
    const onNodeClick = useCallback((_, node) => {
        setNodes(ns =>
        ns.map(n =>
            n.id === node.id
            ? {
                ...n,
                data: { ...n.data, done: !n.data.done },
                }
            : n
        )
        )
    }, [setNodes])

    const onInit = useCallback(flow => {
    const zoom = 1.3
    const yOffset = -100
    const xOffset = -200
    const { x: nx, y: ny } = nodesInit[0].position

    const vw = window.innerWidth
    const vh = window.innerHeight

    const panX = vw / 2 - (nx - xOffset) * zoom
    const panY = vh / 2 - (ny - yOffset) * zoom

    flow.setViewport({ x: panX, y: panY, zoom })
    }, [])

  return (
    <div className="relative w-full h-screen bg-[#0e0e0e]">
      <div className=" px-28 z-50 absolute top-0 left-0 w-full flex items-center justify-between p-4 bg-[#0e0e0e] bg-opacity-80">
        <button
          onClick={() => history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-[#E4E4E4] text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200">
          <ArrowLeftIcon className="w-5 h-5" />
          Voltar
        </button>
        <div className="text-center text-white">
          <h1 className="text-4xl font-semibold text-white/90">C++: Avançado</h1>
          <p className="text-lg font-semibold">
            <span className='text-[#E4E4E4]'>{gainedXp}/</span><span className='text-green-600'>{totalXp} XP</span>
          </p>
        </div>
        <div className="w-30 h-30 flex flex-col items-center mt-6">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size/2}
              cy={size/2}
              r={radius}
              stroke="#333"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx={size/2}
              cy={size/2}
              r={radius}
              stroke="#4ade80"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size/2} ${size/2})`}
            />
          </svg>
          <div className="text-green-600 font-semibold text-lg">
            30%
            </div>
        </div>
      </div>

      <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onInit={onInit}
      fitView={false}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag={true}
      zoomOnScroll={true}
    >
      <Controls showInteractive={false} />
    </ReactFlow>
    {!started && (
        <div
          className="absolute inset-0 z-20 bg-gradient-to-t from-black to-transparent flex items-center justify-center"
        >
          <button
            onClick={() => setStarted(true)}
            className="px-40 absolute bottom-20 py-3 bg-[#E4E4E4] text-[#0e0e0e] font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Iniciar Trilha
          </button>
        </div>
      )}
    </div>
  )
}