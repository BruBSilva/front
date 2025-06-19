import { FunnelIcon,  AdjustmentsVerticalIcon, PlusIcon } from '@heroicons/react/24/solid'

const ActionsBar = ({ onFilter, onSort, onAdd }) => (
  <div className="flex justify-between w-full px-16 mb-4 gap-3">
    <div className='flex gap-3'>
    <button
      onClick={onFilter}
      className="flex items-center gap-2 px-4 py-2 bg-[#E4E4E4] rounded-full  text-gray-700 hover:bg-gray-100 font-semibold transition-colors duration-200"
    >
      <FunnelIcon className="w-4 h-4" />
      Filtrar
    </button>

    <button
      onClick={onSort}
      className="flex items-center gap-2 px-4 py-2 bg-[#E4E4E4] text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200"
    >
      <AdjustmentsVerticalIcon className="w-5 h-5" />
      Ordenar
    </button>
    </div>

    <button
      onClick={onAdd}
      className="flex items-center gap-2 px-4 py-2 bg-[#E4E4E4] text-gray-700 font-semibold rounded-full hover:bg-green-600/90 hover:text-white transition-colors duration-200"
    >
      <PlusIcon className="w-5 h-5" />
      Adicionar Trilha
    </button>
  </div>
)

export default ActionsBar