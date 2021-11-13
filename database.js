require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.DB_URL, process.env.DB_KEY)

class API {
    async newParticipant(participant) {
        const { data, error } = await supabase.from('Participants').insert(participant);
        console.log("New Participant DB Query Data: ", data, " Error: ", error)
        const participantID = data[0].participantID;
        const scoreData = await this.addEmptyScoreEntry(participantID);
        return participantID;
    }

    async addEmptyScoreEntry(participantID, facelistID = 1) {
        const { data, error } = await supabase.from('Score').insert({ participantID: participantID, facelistID: facelistID });
        return data;
    }

    async updateScore(participantID, param, score) {
        const { data, error } = await supabase.from('Score').where({ participantID: participantID }).update({
            [param]: score
        });
        return data;
    }

    async fetchData() {
        const { data, error } = await supabase
            .from('Facedata')
            .select();
        if (error) {
            throw (error);
        }
        return data;
    }
    async addNewFace(imageID, name, affiliation) {
        const { data, error } = await supabase.from('Facedata').insert({ imageID: imageID, name: name, affiliation: affiliation });
        return data;
    }

    async checkAdmin(username_arg, hashedpwd_arg) {
        const { data, error } = await supabase.from('Admin').select('username').match({ username: username_arg, hashedpwd: hashedpwd_arg });
        if (data.length > 0) return true;
        else return false;
    }
}

module.exports = API;