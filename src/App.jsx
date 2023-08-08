import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlineHeart, AiOutlineRight } from "react-icons/ai";
//BsTrash
import { BsTrash } from "react-icons/bs";
import { motion, useAnimation } from "framer-motion";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react'
function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [advice, setAdvice] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const localValue = localStorage.getItem("ADVICE");
    if (localValue == null) return [];

    return JSON.parse(localValue);
  });
  console.log(advice);
  useEffect(() => {
    callAdviceApi()
  }, [])
  useEffect(() => {
    localStorage.setItem("ADVICE", JSON.stringify(favorites));
  }, [favorites]);
  
  const callAdviceApi = () => {
    axios
      .get("https://api.adviceslip.com/advice")
      .then((resp) => setAdvice(resp.data.slip));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("hello");
  };
  const addToFavorites = (quote) => {
    // if large scale nato, pedeng i map mo yung favorites array and then istore mo yung mga quotes sa isang array
    if(favorites[favorites.length - 1]?.quote == quote) return
    setFavorites((currFavorites) => {
      return [...currFavorites, {id: crypto.randomUUID(), quote}]
    })
    toast.success('Successfully added to favorites!');
  }
  function deleteFavorite(id) {
    setFavorites(currFavorites => {
      return currFavorites.filter(favorite => favorite.id !== id)
    })
    toast.error('Deleted!');
  }
  console.log(favorites)
  return (
    <>
    <div className="fixed p-7"><Button onClick={onOpen}><AiOutlineHeart color="#A2CDB0" size={20} /></Button></div>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color='#A2CDB0' fontSize='3xl'>Favorites <span>({favorites.length})</span></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {favorites.map(favorite => <ul key={favorite.id} className="border-b-2 p-4 flex justify-between"><li className="text-[#85A389]">{favorite.quote}</li> <motion.button whileHover={{
                scale: 1.2,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.9 }}><BsTrash color="#A2CDB0" size={20} onClick={() => deleteFavorite(favorite.id)}/></motion.button></ul> )}
          </ModalBody>

          <ModalFooter>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="flex w-full h-screen font-['Raleway']">
        <div className="bg-[#FFD89C] h-screen basis-[55%] flex items-center">
          <div className="ml-8">
            <motion.h1
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="font-black text-8xl text-white"
            >
              The Guide to <br />
              <span className="text-[#A2CDB0]">Stoicism</span>
            </motion.h1>
            <motion.form
              onSubmit={handleSubmit}
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="mt-9 ml-5"
            >
              <input
                type="text"
                placeholder="Enter your favorites"
                className="w-80 h-14 pl-4 rounded-l-3xl font-bold focus:outline-[#A2CDB0] outline-4 text-[#85A389]"
                onChange={(e) => setAdvice(e.target.value)}
              />
              <button className="h-14 bg-[#A2CDB0] w-24 text-white font-bold rounded-r-3xl">
                Search
              </button>
            </motion.form>
          </div>
        </div>
        <div className="bg-[#A2CDB0] h-screen basis-[45%] flex flex-col justify-center">
          <div className="h-[230px] w-[537px] bg-white mx-4 text-center rounded-[2rem] shadow-2xl">
            <div className="p-8">
              <span className="uppercase text-[#A2CDB0] font-bold text-xl">Advice # <span className="font-black">{advice.id}</span></span>
            </div>
            <h2 className="text-[#A2CDB0] text-2xl font-bold">
              {advice.advice}
            </h2>
          </div>
          <div className="flex justify-center gap-3 mx-6 mt-4">
            <motion.button
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.9 }}
              className="p-4 bg-white rounded-full"
              onClick={() => addToFavorites(advice.advice)}
            >
              <AiOutlineHeart color="#A2CDB0" size={20} />
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.3 },
              }}
              onClick={callAdviceApi}
              whileTap={{ scale: 0.9 }}
              className="p-4 bg-white rounded-full"
            >
              <AiOutlineRight color="#A2CDB0" size={20} />
            </motion.button>
          </div>
        </div>
      </div>
      <div className="fixed p-7 bottom-2 w-full"><p className="inline text-white font-black">Made with 💜 by Harvey Taningco</p> </div>
      <Toaster 
      position="bottom-right"
      />
    </>
  );
}

export default App;
