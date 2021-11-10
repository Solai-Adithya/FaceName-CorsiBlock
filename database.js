require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.DB_URL, process.env.DB_KEY)

class API {

  async newParticipant(participant) {
    const facelistID = 1; //later randomise it or alter according to business logic.
    const { dataResponse, error } = await supabase.from('Participants').insert({age: participant.age, facelistID: facelistID});
    // const { dataResponse2, error2 } = await supabase.from('Participants').select(max('participantID')); //not working now, may have to add view statement.
    // console.log("Data Response 1: ", dataResponse, "Data Response 2:", dataResponse2);
  }
}

const object = new API();
object.newParticipant({age: "22"});