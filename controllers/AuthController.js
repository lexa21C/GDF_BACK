const { compare } = require('../helpers/Bycript')
const { tokenSign,decodeSign } = require('../helpers/token')
const userModel = require('../models/Users.js')
const training_center =require('../models/Training_centers')
const ApiStructure = require('../helpers/responseApi.js')

exports.signup = async (req, res) => {
        const { email, password } = req.body
        const apiStructure = new ApiStructure();
        try{
            const user = await userModel.findOne({email}).populate('formation_program').populate('type_profile').populate('training_center')     
            // .populate({path:'training_center',
            // populate:{
            //  path:'regionale',
            //  model:'Regionales'
            // }})  
            console.log(user);
            if (!user) {
                apiStructure.setStatus(404,"error", "no existe el usuario");
            }else{
                
                const checkPassword = await compare(password, user.password)

                const tokenSession = await tokenSign(user)

                console.log(tokenSession)
                
                if (checkPassword) {
                    return res.send({
                        user: user,
                        tokenSession
                    })
                   
                }
                
                if (!checkPassword) {
                    apiStructure.setStatus(409,"error", "credenciales invalidas");
                }
            }
    

    

            res.json(apiStructure.toResponse())

        }catch(err){
           apiStructure.setStatus(500,'error',err.message)
           res.json(apiStructure.toResponse())
        }


};

exports.singDecode=async(req,res)=>{
        const {token}=req.body
        const apiStructure = new ApiStructure();
        try{
            const decode = await decodeSign(token);
            apiStructure.setResult(decode)

        }catch(err){
            apistructure.setStatus(
                500, 
                'error', 
                 err.message)
        }
        res.json(apiStructure.toResponse());
}

