require('dotenv/config');

const { request } = require('express');
const{Airlines} = require('../models');
const { where } = require('sequelize');

const getAllAirlines = async (req, res) => {
    try{
        const allAirlines = await Airlines.findAll();

        res.status(200).json({
            status: "Success",
            message: "Airline successfully retrieved",
            requestAt: req.requestTime,
            data: {allAirlines}
        });
    }catch (error){
        res.status(500).json({
            status:"Failed",
            message: error.message,
        });
    }
};

const getAirlineById = async (req, res) => {
    try{
        const id = req.params.id;
        const airline = await Airlines.findByPk(id);
        if(!airline){
            throw new Error ('Airline not found');
        }
        res.status(200).json({
            status: "Success",
            message:`Airline with id ${id} successfully retrieved`,
            reqestAt: req.requestTime,
            data: {airline},
        });
    }catch(error){
        res.status(404).json({
            status:"Failed",
            message: error.message,
        });
    }
};

const createAirline = async (req, res) => {
    try {
        const data = req.body;
        const files = req.files;

        data.created_at = new Date();
        data.updated_at = new Date();
        data.airline_picture ='';

        const newAirline = await Airlines.create(data);

        res.status(201).json({
            status: "Success",
            message: "Airline successfully created",
            data:{newAirline},
        })
    }catch(error){
        res.status(400).json({
            status: "Failed",
            message:error.message
        });
    }
};

const updateAirline = async (req, res) =>{
    try {
        const updateAirline = await Airlines.findByPk(req.params.id);
        const data = req.body;
        const file = req.file;

        await Airlines.update(data, {
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            status: "Success",
            message: "Airline Successfully Updated",
            requesatAt: req.requestTime,
            data:{updateAirline},
        });
    }catch(error){
        res.status(400).json({
            status: "Failed",
            message: error.message,
        });
    }
};

const deleteAirline = async (req, res) => {
    try {
        const airline = await Airlines.findByPk(req.params.id);

        if (!airline){
            throw Error('Airline not Found');
        }
        await Airlines.destroy({
            where:{
                id:req.params.id,
            }
        });
        res.status(200).json({
            status: "Success",
            message:"Airline with is successfully deleted",
            requestAt: req.requestTime,
        });
    }catch(error){
        res.status(400).json({
            status:"Failed",
            message: error.message,
        });
    }
};
module.exports = {
    getAllAirlines,
    getAirlineById,
    createAirline,
    updateAirline,
    deleteAirline
};