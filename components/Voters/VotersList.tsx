"use client"

import ChevronDownIcon from "@/components/icon-components/ChevronDownIcon"
import InfoIcon from "@/components/icon-components/InfoIcon"
import UserIcon from "@/components/icon-components/UserIcon"
import { useState } from "react"
import QuadraticInfoModal from "../Modals/QuadraticInfoModal"

interface Voter {
  id: string
  username: string
  votes: {
    option: string
    count: number
  }[]
}

const voters: Voter[] = [
  {
    id: "1",
    username: "@mitch.1306",
    votes: [
      { option: "Polygon", count: 5.55 },
      { option: "Optimism", count: 5.55 },
      { option: "Avalanche", count: 5.55 },
      { option: "BNB Smart Chain", count: 0 },
    ],
  },
  {
    id: "2",
    username: "@sarah.bright",
    votes: [
      { option: "Polygon", count: 3.87 },
      { option: "Optimism", count: 2.0 },
      { option: "Avalanche", count: 0 },
      { option: "BNB Smart Chain", count: 7.75 },
    ],
  },
  {
    id: "3",
    username: "@john.doe",
    votes: [
      { option: "Polygon", count: 1.0 },
      { option: "Optimism", count: 9.0 },
      { option: "Avalanche", count: 2.24 },
      { option: "BNB Smart Chain", count: 0 },
    ],
  },
  {
    id: "4",
    username: "@emily.james",
    votes: [
      { option: "Polygon", count: 4.47 },
      { option: "Optimism", count: 4.47 },
      { option: "Avalanche", count: 0 },
      { option: "BNB Smart Chain", count: 4.47 },
    ],
  },
  {
    id: "5",
    username: "@tom.smith",
    votes: [
      { option: "Polygon", count: 8.66 },
      { option: "Optimism", count: 0 },
      { option: "Avalanche", count: 3.0 },
      { option: "BNB Smart Chain", count: 0 },
    ],
  },
  {
    id: "6",
    username: "@lisa.white",
    votes: [
      { option: "Polygon", count: 2.24 },
      { option: "Optimism", count: 2.24 },
      { option: "Avalanche", count: 2.24 },
      { option: "BNB Smart Chain", count: 6.32 },
    ],
  },
  {
    id: "7",
    username: "@kevin.brown",
    votes: [
      { option: "Polygon", count: 0 },
      { option: "Optimism", count: 7.75 },
      { option: "Avalanche", count: 3.87 },
      { option: "BNB Smart Chain", count: 0 },
    ],
  },
  {
    id: "8",
    username: "@anna.jones",
    votes: [
      { option: "Polygon", count: 5.0 },
      { option: "Optimism", count: 0 },
      { option: "Avalanche", count: 5.0 },
      { option: "BNB Smart Chain", count: 3.0 },
    ],
  },
  {
    id: "9",
    username: "@mike.davis",
    votes: [
      { option: "Polygon", count: 3.0 },
      { option: "Optimism", count: 3.0 },
      { option: "Avalanche", count: 3.0 },
      { option: "BNB Smart Chain", count: 3.0 },
    ],
  },
  {
    id: "10",
    username: "@julia.miller",
    votes: [
      { option: "Polygon", count: 10.0 },
      { option: "Optimism", count: 0 },
      { option: "Avalanche", count: 0 },
      { option: "BNB Smart Chain", count: 0 },
    ],
  },
  {
    id: "11",
    username: "@chris.taylor",
    votes: [
      { option: "Polygon", count: 0 },
      { option: "Optimism", count: 0 },
      { option: "Avalanche", count: 12.0 },
      { option: "BNB Smart Chain", count: 0 },
    ],
  },
]

export default function VotersList() {
  const [expandedVoter, setExpandedVoter] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const toggleVoter = (id: string) => {
    if (expandedVoter === id) {
      setExpandedVoter(null)
    } else {
      setExpandedVoter(id)
    }
  }

  const getTotalVotes = (votes: { option: string; count: number }[]) => {
    return votes.reduce((sum, vote) => sum + vote.count, 0)
  }

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium">Check out how others voted in this poll</h2>
        <button onClick={() => setShowModal(true)}>
          <InfoIcon />
        </button>
      </div>

      <div className="space-y-2">
        {voters.map((voter) => (
          <div key={voter.id} className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleVoter(voter.id)}>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <UserIcon size={24} />
                </div>
                <span>{voter.username}</span>
              </div>
              <div
                className={`transform transition-transform duration-300 ${expandedVoter === voter.id ? "rotate-180" : ""}`}
              >
                <ChevronDownIcon />
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedVoter === voter.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 pb-4">
                {voter.votes.map((vote, index) => (
                  <div key={index} className="flex justify-between py-2">
                    <span>{vote.option}</span>
                    <span className="text-gray-500">{vote.count} votes</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                  <span className="font-medium">Total votes:</span>
                  <span className="font-medium">{getTotalVotes(voter.votes).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <QuadraticInfoModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
