import React, { useState, useRef, useCallback } from 'react'

export default function TrackDrawer({ node, onClose, onToggleDone }) {
  const [width, setWidth] = useState(384) // 384px = w-96
  const [isResizing, setIsResizing] = useState(false)
  const drawerRef = useRef(null)

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsResizing(true)
    
    const startX = e.clientX
    const startWidth = drawerRef.current.offsetWidth
    
    const handleMouseMove = (e) => {
      const newWidth = startWidth + (startX - e.clientX)
      const clampedWidth = Math.max(300, newWidth) // Apenas limite mínimo de 300px
      
      // Atualizar diretamente o DOM para zero delay
      drawerRef.current.style.width = `${clampedWidth}px`
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.body.style.pointerEvents = ''
      
      // Sincronizar o state apenas no final
      const finalWidth = parseInt(drawerRef.current.style.width)
      setWidth(finalWidth)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
    document.body.style.pointerEvents = 'none'
  }, [])

  if (!node) return null

  return (
    <div 
      ref={drawerRef}
      className="z-[999] h-screen fixed top-0 right-0 bg-[#E4E4E4] shadow-lg flex flex-col p-7"
      style={{ width: `${width}px` }}
    >
      {/* Resize handle */}
      <div
        className={`absolute left-0 top-0 w-1 h-full cursor-ew-resize transition-colors ${
          isResizing ? 'bg-blue-500' : 'bg-gray-400 hover:bg-blue-400'
        }`}
        onMouseDown={handleMouseDown}
        title="Arraste para redimensionar"
      />
      <div className="w-full flex justify-between items-center mb-4">
        <button
          onClick={onClose}
          className="bg-white text-black px-1.5 py-2 rounded-2xl shadow-lg hover:bg-gray-100 transition-colors duration-300"
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleDone(node.id)}
            className={`flex items-center py-2 px-3 rounded-xl shadow-lg transition-colors duration-300 ${
              node.data.done ? 'bg-green-600 text-white cursor-default' : 
              node.data.isCurrent ? 'bg-blue-500 text-white hover:bg-blue-600' : 
              'bg-gray-400 text-gray-700 cursor-not-allowed'
            }`}
            disabled={!node.data.isCurrent}
          >
            <span
              className={`h-3 w-3 rounded-full mr-2 ${
                node.data.done ? 'bg-green-300' : 
                node.data.isCurrent ? 'bg-blue-300' : 
                'bg-gray-300'
              }`}
            />
            {node.data.done ? 'Módulo Concluído' : 
             node.data.isCurrent ? 'Concluir Módulo' : 
             'Módulo Bloqueado'}
          </button>
        </div>
      </div>

      <div className="p-4 overflow-auto flex-1">
        <h2 className="text-center font-semibold mb-4 text-3xl text-black">{node.data.label}</h2>
        <div 
          className="text-sm leading-relaxed drawer-content"
          style={{
            color: '#333',
            lineHeight: '1.6'
          }}
          dangerouslySetInnerHTML={{ 
            __html: node.data.description?.replace(/\n/g, '<br />') || '' 
          }}
        />
      </div>
      
      {/* Estilos globais para o conteúdo HTML */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .drawer-content h1, .drawer-content h2, .drawer-content h3 {
            margin-bottom: 1rem;
            font-weight: 600;
          }
          .drawer-content h1 { font-size: 1.5rem; }
          .drawer-content h2 { font-size: 1.25rem; }
          .drawer-content h3 { font-size: 1.125rem; }
          .drawer-content p {
            margin-bottom: 1rem;
          }
          .drawer-content ul, .drawer-content ol {
            margin: 1rem 0;
            padding-left: 1.5rem;
          }
          .drawer-content li {
            margin-bottom: 0.5rem;
          }
          .drawer-content a {
            color: #3b82f6;
            text-decoration: underline;
          }
          .drawer-content a:hover {
            color: #1d4ed8;
          }
          .drawer-content strong {
            font-weight: 600;
          }
          .drawer-content em {
            font-style: italic;
          }
          .drawer-content code {
            background-color: #f3f4f6;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-family: monospace;
            font-size: 0.875em;
          }
          .drawer-content pre {
            background-color: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
          .drawer-content blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: #6b7280;
          }
          .drawer-content img {
            max-width: 100%;
            height: auto;
            margin: 1rem 0;
            border-radius: 0.5rem;
          }
          .drawer-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
          }
          .drawer-content th, .drawer-content td {
            padding: 0.5rem;
            border: 1px solid #e5e7eb;
            text-align: left;
          }
          .drawer-content th {
            background-color: #f9fafb;
            font-weight: 600;
          }
        `
      }} />
    </div>
  )
}