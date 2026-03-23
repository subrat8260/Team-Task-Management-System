const Team = require("../models/TeamModel");
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("member", "username email");
    res.status(200).json({ success: true, date: teams });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error message:" });
  }
};
exports.postTeam = async (req, res) => {
  const { name } = req.body;
  const newTeam = new Team({
    name,
    createdBy: req.user._id,
  });
  await newTeam.save();
  res.status(201).json({ message: "Team created successfully", team: newTeam });
};
exports.postAddUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const team = await Team.findById(id);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }
  if (team.member.includes(userId)) {
    return res.status(400).json({ message: "User already in team" });
  }
  team.member.push(userId);
  await team.save();
  res.status(200).json({ message: "User added to team successfully", team });
};
