import React, { useEffect, useRef } from 'react'

export default function AudioPlayer({ src, playOnMount }){
  const ref = useRef(null)
  useEffect(()=>{
    if(playOnMount && ref.current){
      try{ ref.current.volume = 0.2; ref.current.play().catch(()=>{} ) }catch(e){}
    }
  },[playOnMount])
  return (
    <audio ref={ref} src={src} style={{display:'none'}} preload="auto" />
  )
}
