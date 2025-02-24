import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import NavBar from "../../components/NavBar/NavBar";
import AddEditNotes from "./AddEditNotes";
import { useState } from "react";
import Modal from "react-modal"

export default function Home() {
  const [openAddEditModal,setOpenAddEditModal]=useState({
    isShown:false,
    type:"add",
    data:null,
  })
  return (
 <>
  <NavBar />

  <div className="container mx-auto">
  <div className="grid grid-cols-3 gap-4 mt-8">


  <NoteCard 
    title="huiahfjinqaejkn"
    date="3rd Apr 2024"
    content="iufifewjifnjkjjkksksdmkfmjmfj"
    tags="#metter"
    isPinned={true}
    onDelete={()=>{}}
    onEdit={()=>{}}
    onPinNote={()=>{}}

  />

  </div>
  </div>
  <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-900 hover:bg-blue-600 absolute right-10 bottom-10" onClick={() =>{
    setOpenAddEditModal({isShown:true,type:"add",data:null});
  }}>
  <MdAdd 
    className="text-[32px] text-white"
  />

  </button>

  <Modal
  isOpen={openAddEditModal.isShown}
  onRequestClose={()=>{}}
  style={{
    overlay:{
      backgroundColor:"rgba(0,0,0,0.5)",
    }
  }}
  contentLabel=""
  className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
  >

  <AddEditNotes />
  </Modal>
 </>
  );
}
