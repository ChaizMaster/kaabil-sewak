"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationStatus = exports.JobStatus = void 0;
var JobStatus;
(function (JobStatus) {
    JobStatus["ACTIVE"] = "active";
    JobStatus["CLOSED"] = "closed";
    JobStatus["FILLED"] = "filled";
    JobStatus["CANCELLED"] = "cancelled";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
var JobApplicationStatus;
(function (JobApplicationStatus) {
    JobApplicationStatus["PENDING"] = "pending";
    JobApplicationStatus["ACCEPTED"] = "accepted";
    JobApplicationStatus["REJECTED"] = "rejected";
    JobApplicationStatus["WITHDRAWN"] = "withdrawn";
})(JobApplicationStatus || (exports.JobApplicationStatus = JobApplicationStatus = {}));
//# sourceMappingURL=job.types.js.map