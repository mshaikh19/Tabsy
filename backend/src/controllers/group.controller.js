const groupService = require("../services/group.service");

const listGroups = async (req, res, next) => {
  try {
    const groups = await groupService.listGroups(req.user._id);
    res.status(200).json({ status: "success", results: groups.length, data: { groups } });
  } catch (error) {
    next(error);
  }
};

const getGroup = async (req, res, next) => {
  try {
    const group = await groupService.getGroup(req.user._id, req.params.id);
    res.status(200).json({ status: "success", data: { group } });
  } catch (error) {
    next(error);
  }
};

const createGroup = async (req, res, next) => {
  try {
    const group = await groupService.createGroup(req.user._id, req.body);
    res.status(201).json({ status: "success", data: { group } });
  } catch (error) {
    next(error);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const group = await groupService.updateGroup(req.user._id, req.params.id, req.body);
    res.status(200).json({ status: "success", data: { group } });
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    const result = await groupService.deleteGroup(req.user._id, req.params.id);
    res.status(200).json({ status: "success", message: result.message });
  } catch (error) {
    next(error);
  }
};

const listMembers = async (req, res, next) => {
  try {
    const members = await groupService.listMembers(req.user._id, req.params.id);
    res.status(200).json({ status: "success", results: members.length, data: { members } });
  } catch (error) {
    next(error);
  }
};

const addMembers = async (req, res, next) => {
  try {
    const result = await groupService.addMembers(req.user._id, req.params.id, req.body);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const updateMemberRole = async (req, res, next) => {
  try {
    const members = await groupService.updateMemberRole(
      req.user._id,
      req.params.id,
      req.params.userId,
      req.body.role,
    );
    res.status(200).json({ status: "success", data: { members } });
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const members = await groupService.removeMember(
      req.user._id,
      req.params.id,
      req.params.userId,
    );
    res.status(200).json({ status: "success", data: { members } });
  } catch (error) {
    next(error);
  }
};

const leaveGroup = async (req, res, next) => {
  try {
    const result = await groupService.leaveGroup(req.user._id, req.params.id);
    res.status(200).json({ status: "success", message: result.message });
  } catch (error) {
    next(error);
  }
};

const joinByInvite = async (req, res, next) => {
  try {
    const group = await groupService.joinByInvite(req.user._id, req.body.code);
    res.status(200).json({ status: "success", data: { group } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  listMembers,
  addMembers,
  updateMemberRole,
  removeMember,
  leaveGroup,
  joinByInvite,
};