import { MdAdd } from "react-icons/md"

const TagInput = ({tags,setTags}) => {
  return (
    <div>
        <div>
            <div className="flex items-center gap-4 mt-3">
             <input 
                type="text"
                placeholder="Add tags"
                className="text-sm bg-transparent border px-3 py-2 rounded"
             />
             <button>
                <MdAdd
                    className=""
                />
             </button>
            </div>
        </div>
    </div>
  )
}

export default TagInput