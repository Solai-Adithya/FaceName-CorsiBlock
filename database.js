require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.DB_URL, process.env.DB_KEY)

class API {

  async newParticipant(participant) {
    const facelistID = 1; //later randomise it or alter according to business logic.
    const { data, error } = await supabase.from('Participants').insert({age: participant.age, facelistID: facelistID});
    const participantID = data[0].participantID;
    return participantID;
  }

  async updateScore(participantID, param, score) {
    const { data, error } = await supabase.from('Participants').where('participantID', participantID).update({[param]: score});
  }

}

module.exports = API;