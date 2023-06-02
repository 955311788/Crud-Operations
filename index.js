require('dotenv/config');
const express = require('express');
const asyncHandler = require('express-async-handler');
const certificates = require('./certificate_model.js');
const planes = require('./plane_model.js');
const members = require('./member_model.js');


const app = express();

const PORT = process.env.PORT;

app.use(express.static('public'));


app.get("/create", asyncHandler(async function(req, res)  {
    const { certificateNumber, name, Address, nationality, dob } = req.query;

    const certificate = await certificates.createUserCertificate(
        certificateNumber,
        name,
        Address,
        nationality,
        dob);

    res.send(certificate);

}));

app.get("/retrieve", asyncHandler(async function(req, res)  {
    const filter = {};
    if (req.query.certificateNumber !== undefined) {
      filter.certificateNumber = req.query.certificateNumber;
    }
  
    const result = await certificates.findUserCertificate(filter);
  
    if (result.length === 0) {
      return res.status(404).json({ Error: "Certificate not found" });
    }
  
    const certificate = result[0]; // Assuming you only want to retrieve the first matching certificate
  
    // Prepare the data to be populated in the form fields
    const formData = {
      certificateNumber: certificate.certificateNumber,
      name: certificate.name,
      Address: certificate.Address,
      nationality: certificate.nationality,
      dob: certificate.dob.toISOString().split("T")[0], // Format the date as yyyy-mm-dd
    };
  
    res.send(formData);
  }));

app.get("/update", asyncHandler(async function(req, res) {

    const certificateNumber = req.query.certificateNumber;

    const {name, Address, nationality, dob } = req.query;

    const existingCertificate = await certificates.findUserCertificate({ certificateNumber });
    if (existingCertificate.length === 0) {
      return res.status(404).json({ Error: "Certificate not found" });
    }
  
    const update = {
      name,
      Address,
      nationality,
      dob: new Date(dob),
    };
  
    const result = await certificates.updateUserCertificate({ certificateNumber }, update);
    res.send({ numOfCertificatesUpdated: result.modifiedCount });
  }));


app.get("/delete", asyncHandler(async function(req, res) {

    const filter = {};
    if (req.query.certificateNumber !== undefined) {
      filter.certificateNumber = req.query.certificateNumber;
    }else{

    }
    if (req.query.name !== undefined) {
      filter.name = req.query.name;
    }
    if (req.query.Address !== undefined) {
      filter.Address = req.query.Address;
    }
    if (req.query.nationality !== undefined) {
      filter.nationality = req.query.nationality;
    }
    if (req.query.dob !== undefined) {
      filter.dob = req.query.dob;
    }
  
    const result = await certificates.deleteCertificate(filter);
    res.send({numOfCertificatesDeleted: result});
    

}));

// -----------------------------------------------------------------------------------------------------------------------------------------
// controller for addition of planes.
//------------------------------------------------------------------------------------------------------------------------------------------
app.get("/createPlane", asyncHandler(async function(req, res) {
  const { planeID, year, make, model, color, horsepower} = req.query;
  const vfr = req.query.vfr === "on" ? true: false; 

  const plane = await planes.createPlane(
      planeID,
      year,
      make,
      model,
      color,
      horsepower,
      vfr)
  res.send(plane)

}));

//-----------------------------------------------------------------
//to populate drop down list 
//--------------------------------------------------------------
app.get("/retrievePlanes", asyncHandler(async function(req, res) {
  const result = await planes.findAllPlanes();

  if (result.length === 0) {
    return res.status(404).json({ Error: "No planes found" });
  }

  const planeIDs = result.map(plane => plane.planeID);

  res.send(planeIDs);
}));

//-------------------------------------------------------------------------------------------------------------------------

app.get("/retrievePlane", asyncHandler(async function(req, res) {
  const filter = {};
  if (req.query.planeID !== undefined) {
    filter.planeID = req.query.planeID;
  }

  const result = await planes.findPlaneID(filter);

  if (result.length === 0) {
    return res.status(404).json({ Error: "plane not found" });
  }

  const plane = result[0];

  res.send(plane);


}));

app.get("/updatePlane", asyncHandler(async function(req, res) {

  const planeId = req.query.planeID;

  const {year, make, model, color, horsepower} = req.query;
  const vfr = req.query.vfr === "on" ? true: false;

  const existingPlane = await planes.findPlaneID({ planeID: planeId });
  if (existingPlane.length === 0) {
    return res.status(404).json({ Error: "Plane not found" });
  }

  const update = {
    year,
    make,
    model,
    color,
    horsepower,
    vfr
  };

  const result = await planes.updatePlane({ planeID: planeId }, update);
  res.send({ numOfPlanesUpdated: result.modifiedCount });
}));


app.get("/deletePlane", asyncHandler(async function(req, res) {

  const filter = {};
  if (req.query.planeID !== undefined) {
    filter.planeID = req.query.planeID;
  }else{

  }
  if (req.query.year !== undefined) {
    filter.year = req.query.year;
  }
  if (req.query.make !== undefined) {
    filter.make = req.query.make;
  }
  if (req.query.model !== undefined) {
    filter.model = req.query.model;
  }
  if (req.query.color !== undefined) {
    filter.color = req.query.color;
  }
  if (req.query.horsepower !== undefined) {
      filter.horsepower = req.query.horsepower;
  }

  const result = await planes.deletePlane(filter);
  res.send({numOfPlanesDeleted: result});
  

}));

//--------------------------------------------------------------------------------------------------------------------------
// Member controller code
//-----------------------------------------------------------------------------
app.get("/createMember", asyncHandler(async function(req, res) {
  const {memberID, certificateID, lastName, firstName, address, phoneNumber, email, dob} = req.query; 

  const member = await members.createMember(
      memberID,
      certificateID, 
      lastName, 
      firstName,
      address, 
      phoneNumber, 
      email,
      dob)


  res.send(member);

}));
// --- retrieve all members for update and delete
app.get("/retrieveMembers", asyncHandler(async function(req, res) {
  const result = await members.findAllMembers();

  if (result.length === 0) {
    return res.status(404).json({ Error: "No members found" });
  }

  const memberIDs = result.map(member => member.memberID);

  res.send(memberIDs);
}));


app.get("/retrieveMember", asyncHandler(async function(req, res) {
  const filter = {};
  if (req.query.memberID !== undefined) {
    filter.memberID = req.query.memberID;
  }

  const result = await members.findMember(filter);

  if (result.length === 0) {
    return res.status(404).json({ Error: "Member not found" });
  }

  const member = result[0];

  res.send(member);


}));

app.get("/updateMember", asyncHandler(async function(req, res) {

  const memberId = req.query.memberID;

  const {lastName, firstName, address, phoneNumber, email, dob} = req.query;
  

  const existingMember = await members.findMember({ memberID: memberId });
  if (existingMember.length === 0) {
    return res.status(404).json({ Error: "Member not found" });
  }

  const update = {
    lastName,
    firstName, 
    address,
    phoneNumber, 
    email,
    dob
  };

  const result = await members.updateMember({ memberID: memberId }, update);
  res.send({ numOfMembersUpdated: result.modifiedCount });
}));


app.get("/deleteMember", asyncHandler(async function(req, res) {

  const filter = {};
  if (req.query.memberID !== undefined) {
    filter.memberID = req.query.memberID;
  }else{

  }
  if (req.query.lastName !== undefined) {
    filter.lastName = req.query.lastName;
  }
  if (req.query.firstName !== undefined) {
    filter.firstName = req.query.firstName;
  }
  if (req.query.address !== undefined) {
    filter.address = req.query.address;
  }
  if (req.query.phoneNumber !== undefined) {
    filter.phoneNumber = req.query.phoneNumber;
  }
  if (req.query.email !== undefined) {
      filter.email = req.query.email;
  }

  const result = await members.deleteMember(filter);
  res.send({numOfMembersDeleted: result});
  

}));


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});


//app.get("/retrieve", asyncHandler(async (req, res) => {
    //const filter = {}; 
    //if(req.query.name !== undefined){
        //filter.name = req.query.name
    //}
    //if (req.query.Address !== undefined) {
        //filter.Address = req.query.Address;
    //}
    //if (req.query.nationality !== undefined) {
         //filter.nationality = req.query.nationality;
    //}
    //if (req.query.dob !== undefined) {
        // filter.dob = req.query.dob;
    //}
    //if (req.query.certificateNumber !== undefined) {
        //  filter.certificateNumber = req.query.certificateNumber;
    //}

    //const result = await certificates.findUserCertificate(filter);
    //res.send(result)
//}))