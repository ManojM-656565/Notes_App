import TagInput from "../../components/Input/TagInput"

const AddEditNotes = () => {
  return (
    // <div>AddEditNotes</div>
    <div>
<div className="flex flex-col gap-2">
<label className="text-xs text-slate-400">TITLE</label>
    <input 
        type="text"
        className="text-2xl text-slate-950 outline-none"
        placeholder="GO to gynm"
    />
</div>
<div className="flex flex-col gap-2 mt-4">
<label className="text-xs text-slate-400">CONTENT</label>
    <textarea 
        type="text"
        className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
        placeholder="Content"
        rows={10}
    />
</div>
<div className="mt-3">
    <label className="text-xs text-slate-400">TAGS
    </label>
    <TagInput />
</div>
<button className="w-full text-sm bg-blue-500 text-white p-2 rounded my-1 hover:bg-blue-600 font-medium mt-5 p-3"
onClick={()=>{}}>ADD</button>
</div>
  )
}

export default AddEditNotes