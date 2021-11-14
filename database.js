try {
    require('dotenv').config()
} catch (error) {
    console.log(error);
}

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
        //Add admin feature to change facelistID being served.
        const { data, error } = await supabase.from('Score').insert({ participantID: participantID, facelistID: facelistID });
        return data;
    }

    async updateScore(participantID, param, score) {
        const { data, error } = await supabase.from('Score').where({ participantID: participantID }).update({
            [param]: score
        });
        return data;
    }

    async fetchImageSequence(facelistID) {
        const { data, error } = await supabase.from('Facelist').select('image_sequence').match({ facelistID: facelistID });
        console.log("Image Sequence: ", data[0].image_sequence)
        return data[0].image_sequence;
    }

    async fetchFaceData(selectionString = "imageID, name, affiliation", facelistID = 1) {
        const imageSequenceString = await this.fetchImageSequence(facelistID);
        const imageSequence = imageSequenceString.split(',');
        console.log("Image sequence retrieved is: ", imageSequence)
        const { data, error } = await supabase.from('Facedata').select().in('imageID', imageSequence);
        console.log("Facedata: ", data);
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
    
    async fetch_lastimg(gender) {
        const { data, error } = await supabase.from('last_face').select('number').match({ gender: gender });
        //console.log("Number: ", data[0].number);
        return data[0].number;
    }

    async update_lastimg(gender, img_num) {
        const { data2, error2 } = await supabase.from('last_face').update({number: img_num}).match({ gender: gender });
       // console.log("Image number updated ");
        return 1;
    }

    async saveCorsiScore(participantID, correctCount, longestSpan) {
        const { data, error } = await supabase.from('CorsiblockScores').insert({ participantID: participantID, correctCount: correctCount, longestSpan: longestSpan });
        if (error)
            throw (error)
        return data;
    }
}

module.exports = API;
