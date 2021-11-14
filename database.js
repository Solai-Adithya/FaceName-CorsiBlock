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

    async addEmptyScoreEntry(participantID) {
        //Add admin feature to change facelistID being served.
        const activeFacelistID = await this.fetchActiveFacelist();
        const { data, error } = await supabase.from('FacenameScore').insert({ participantID: participantID, facelistID: activeFacelistID });
        return data;
    }

    async updateScore(participantID, param, score) {
        const { data, error } = await supabase.from('FacenameScore').update({
            [param]: score
        }).match({ participantID: participantID });
        return data;
    }

    async fetchActiveFacelist() {
        const { data, error } = await supabase.from('Facelist').select('facelistID').match({ active: true });
        return data[0].facelistID;
    }

    async fetchImageSequence() {
        const { data, error } = await supabase.from('Facelist').select('image_sequence').match({ active: true }); 
        console.log("Image Sequence: ", data)
        return data[0].image_sequence;
    }

    async fetchFaceData(selectionString = "imageID, name, affiliation") {
        const imageSequenceString = await this.fetchImageSequence();
        const imageSequence = imageSequenceString.split(',');
        console.log("Image sequence retrieved is: ", imageSequence)
        const { data, error } = await supabase.from('Facedata').select(selectionString).in('imageID', imageSequence);
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