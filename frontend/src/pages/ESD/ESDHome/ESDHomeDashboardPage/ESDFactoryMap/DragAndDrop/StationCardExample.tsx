import { useState, useCallback, useEffect } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Plus } from "lucide-react"
import {
  Button
} from "antd";
import React from "react";

const GRID_SIZE = 50 // Define a fixed grid for alignment

// Types for Station
interface Station {
  id: string
  name: string
  x: number
  y: number
}

// Define a type for the Drag Item
const ItemType = {
  STATION: "station",
}

// Draggable station component
const StationCard = ({
  station,
  moveStation,
}: { station: Station; moveStation: (id: string, x: number, y: number) => void }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.STATION,
    item: { id: station.id, x: station.x, y: station.y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        left: `${station.x}%`,
        top: `${station.y}%`,
        width: `${GRID_SIZE}px`,
        height: `${GRID_SIZE}px`,
        backgroundColor: isDragging ? "lightblue" : "blue",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "move",
        borderRadius: "8px",
      }}
    >
      {station.name} 
    </div>
  )
}

// Main component
const StationCardExample = () => {
  const [stations, setStations] = useState<Station[]>([])

  useEffect(() => {
    // Load stations from localStorage when the component mounts
    const savedStations = localStorage.getItem("stations")
    if (savedStations) {
      setStations(JSON.parse(savedStations))
    } else {
      // If no saved stations, initialize with default stations
      const defaultStations = [
        { id: "1", name: "Estação 1", x: 2, y: 2 },
        { id: "2", name: "Estação 2", x: 6, y: 6 },
      ]
      setStations(defaultStations)
      localStorage.setItem("stations", JSON.stringify(defaultStations))
    }
  }, [])

  const moveStation = useCallback((id: string, x: number, y: number) => {
    setStations((prev) => {
      const newStations = prev.map((station) => (station.id === id ? { ...station, x, y } : station))
      // Save the updated stations to localStorage
      console.log('prev', prev)
      localStorage.setItem("stations", JSON.stringify(newStations))
      return newStations
    })
  }, [])

  const addStation = useCallback(() => {
    const newStation: Station = {
      id: Date.now().toString(),
      name: `Estação ${stations.length + 1}`,
      x: Math.floor(Math.random() * 90), // Random x position
      y: Math.floor(Math.random() * 90), // Random y position
    }
    setStations((prev) => {
      const newStations = [...prev, newStation]
      // Save the updated stations to localStorage
      localStorage.setItem("stations", JSON.stringify(newStations))
      return newStations
    })
  }, [stations])

  const [, drop] = useDrop({
    accept: ItemType.STATION,
    drop: (item: { id: string; x: number; y: number }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()
      if (delta) {
        const x = Math.round((item.x + (delta.x / window.innerWidth) * 100) / 2) * 2
        const y = Math.round((item.y + (delta.y / window.innerHeight) * 100) / 2) * 2
        moveStation(item.id, x, y)
      }
    },
  })

  return (
    <div style={{ padding: "20px" }}>
      <Button onClick={addStation} className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Add Station
      </Button>
      <div
        ref={drop}
        style={{
          width: "100%",
          height: "500px",
          position: "relative",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
        }}
      >
        {stations.map((station) => (
          <StationCard key={station.id} station={station} moveStation={moveStation} />
        ))}
      </div>
    </div>
  )
}

export default StationCardExample

