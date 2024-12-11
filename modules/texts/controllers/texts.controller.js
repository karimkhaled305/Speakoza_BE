
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const axios = require('axios');
const Text = require('../../../DB/Models/texts.model');
const AudioFile = require('../../../DB/Models/audioFile.model');
const textModel = require('../../../DB/Models/texts.model')

const generateAudio = async (req, res) => {

    const { content } = req.body;
    const userId = req.userId;


    if (!content) {
        return res.status(400).json({ error: 'Text content is required' });
    }

    try {
        const ELEVEN_LABS_URL = 'https://api.elevenlabs.io/v1/text-to-speech';
        const textDoc = await Text.create({ content, userId });

        const response = await axios.post(
            `${ELEVEN_LABS_URL}/9BWtsMINqrJLrRacOk9x`,
            { text: content },
            {
                headers: { 'xi-api-key': process.env.ELEVEN_LABS_API_KEY, 'Content-Type': 'application/json' },
                responseType: 'arraybuffer'
            }

        );
        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db, { bucketName: 'audiofiles' });

        const audioStream = bucket.openUploadStream(`audio_${textDoc._id}.mp3`, {
            metadata: {
                textId: textDoc._id,
                userId: userId,
            },
        });

        audioStream.end(response.data);

        audioStream.on('finish', async () => {
            const audioFileDoc = await AudioFile.create({
                textId: textDoc._id,
                fileName: audioStream.filename,
                gridFSId: audioStream.id,
            });

            res.status(201).json({
                message: 'Audio generated successfully',
                audioFile: {
                    id: audioFileDoc._id,
                    gridFSId: audioStream.id,
                },
            });
        });


        audioStream.on('error', (error) => {
            console.error('Error saving file to GridFS:', error);
            res.status(500).json({ error: 'Failed to save audio to database' });
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate audio' });
    }
}

const getAudioFile = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {

        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db, { bucketName: 'audiofiles' });


        const files = await bucket.find({ _id: new mongoose.Types.ObjectId(id) }).toArray();
        if (!files.length) {
            return res.status(404).json({ error: 'File not found' });
        }

        const fileMetadata = files[0].metadata;
        if (fileMetadata && fileMetadata.userId && fileMetadata.userId.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized access to this file' });
        }


        res.set('Content-Type', 'audio/mpeg');
        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(id));
        downloadStream.pipe(res);

        downloadStream.on('error', (error) => {
            console.error('Error retrieving audio file:', error);
            res.status(500).json({ error: 'Error retrieving audio file' });
        });

        downloadStream.on('end', () => {
            console.log('File streamed successfully.');
        });
    } catch (error) {
        console.error('Error fetching file from GridFS:', error);
        res.status(500).json({ error: 'Failed to retrieve audio file' });
    }
};

const getUserAudios = async (req, res) => {
    const userId = req.userId; 

    try {
       
        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db, { bucketName: 'audiofiles' });

      
        const files = await bucket.find({ 'metadata.userId': userId }).toArray();

        
        if (!files.length) {
            return res.status(404).json({ error: 'No audio files found for this user' });
        }

        
        const audioFiles = files.map(file => ({
            id: file._id,
            filename: file.filename,
            metadata: file.metadata,
            textId:file.metadata.textId,
            
        }));

   
            const contents = await textModel.find({userId})
    
    
        res.status(200).json({ audioFiles , contents });
    } catch (error) {
        console.error('Error fetching user audio files:', error);
        res.status(500).json({ error: 'Failed to retrieve audio files' });
    }
};

const deleteAudio = async (req,res)=>{
    const {id,textId} = req.query;

    try {
       
        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db, { bucketName: 'audiofiles' });

      
        // const deleteUser = await bucket.delete({_id:new mongoose.Types.ObjectId(id)});
        // console.log(deleteUser);
     const chunksCollection = db.collection('audiofiles.chunks');
     const filesCollection = db.collection('audiofiles.files');
     const audiofiles = db.collection('audiofiles');
     const texts = db.collection('texts');

     const test = await filesCollection.findOne({_id: new mongoose.Types.ObjectId(id)})

     const deleteFromFiles = await filesCollection.deleteOne({_id:new mongoose.Types.ObjectId(id)});
     const deleteFromChunks = await chunksCollection.deleteOne({files_id:new mongoose.Types.ObjectId(id)})
    const deleteFromTexts = await texts.deleteOne({_id:new mongoose.Types.ObjectId(textId)});
    const deleteFromAudios = await audiofiles.deleteOne({textId: new mongoose.Types.ObjectId(textId)})
       

    console.log(deleteFromFiles.deletedCount , deleteFromTexts.deletedCount);
    if(deleteFromFiles.deletedCount && deleteFromTexts.deletedCount > 0){
        res.status(200).json({ message:'user deleted successfully!' });
    }else {
        res.status(500).json({ error: 'no files found to delete' });
    }
    
        
    } catch (error) {
        console.error('Error deleting audio file:', error);
        res.status(500).json({ error: 'Failed to delete audio file' });
    }

}




module.exports = { generateAudio, getAudioFile, getUserAudios , deleteAudio }