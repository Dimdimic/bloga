import PostModel from '../models/Post.js';

export const getAll = async (req, res) => { //вернуть все статьи
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
         message: 'No get blog',
    });
}
};

export const getOne = async (req, res) => { //вернуть одну статью
    try {
        const postId = req.params.id;
      
        PostModel.findOneAndUpdate({
            _id: postId,  
        }, {
            $inc: { viewsCount: 1},
        }, 
        {
            returnDocument: 'after',
        },
        (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                message: 'No vernyt statiu',
                });
            } 

            if (!doc) {
                return res.status(404).json({
                    message: "Statia ne naydena",
                });
            }

            res.json(doc);
        });  
    } catch (err) {
        console.log(err);
        res.status(500).json({
         message: 'No get blog',
    });
}
};

export const remove = async (req, res) => { //вернуть одну статью
    try {
        const postId = req.params.id;
      
        PostModel.findOneAndDelete({
            _id: postId,

        }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                message: 'No delete statiu',
                });
            }

            if(!doc) {
                return res.status(404).json({
                    message: "Statya ne naydena",
                });
            }

            res.json({
                success: true,
            });

        });  
    } catch (err) {
        console.log(err);
        res.status(500).json({
         message: 'No get blog',
    });
}
};

export const create = async (req, res) => { //создание статей
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.title,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
         message: 'No create blog',
     });
    }
}; 

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        
        await PostModel.updateOne({
            _id: postId,

        }, {
            title: req.body.title,
            text: req.body.title,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
         message: 'No update blog',
        });
    }
};