require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.DB_URL, process.env.DB_KEY)

class API {
  async newParticipant(participant) {
    // for example participant should be an object like {age:19, handedness:'left', ...}
    const { data, error } = await supabase.from('Participants').insert(participant);
    const participantID = data[0].participantID;
    return participantID;
  }

  async updateScore(participantID, param, score) {
    //If row is not present, it will be inserted. If present, row will be updated.
    const { data, error } = await supabase.from('Score').upsert({participantID: participantID, [param]: score});
  }

  async addNewFace(imageID, name, affiliation) {
    const {data, error} = await supabase.from('Facedata').insert({imageID: imageID, name: name, affiliation: affiliation});
  }
}

module.exports = API;