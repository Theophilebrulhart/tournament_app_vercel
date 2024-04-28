
export default function TournamentTree({tournament}) {
 

    return (

    <div className="flex items-center w-full gap-10 space-between">
      <div className="bg-red-500 w-24">
        horaire
      </div>
      <div className=" w-full flex justify-between gap-2">
          {Array.from({ length: tournament.fieldNbr }, (_, index) => (
           <div key={index} style={{ width: `calc(100% / ${tournament.fieldNbr}) `}}>Field {index + 1}</div>

          ))}
      </div>
    </div>
  )
}