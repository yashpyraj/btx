import { useState } from "react";
import { motion } from "framer-motion";
import { IoClose, IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AnimatedTitle from "./AnimatedTitle";

const HierarchyTree = () => {
  const navigate = useNavigate();

  const hierarchy = [
    {
      id: 1,
      department: "War Masters",
      lead: { name: "Shiso", image: "/img/shiso.png" },
      members: [
        { name: "Grim", image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg" },
        { name: "Leo", image: "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg" },
        { name: "Woogy", image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg" },
        { name: "Yammy", image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" },
      ],
    },
    {
      id: 2,
      department: "HR",
      lead: { name: "Masodka", image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg" },
      members: [
        { name: "Z", image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg" },
        { name: "Enchantress N", image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg" },
        { name: "Kay", image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg" },
        { name: "Zoro", image: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg" },
      ],
    },
    {
      id: 3,
      department: "Data",
      lead: { name: "Coco", image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg" },
      members: [
        { name: "Yammy", image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" },
        { name: "Kube", image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg" },
      ],
    },
    {
      id: 4,
      department: "Builder",
      lead: { name: "Shiso", image: "/img/shiso.png" },
      members: [
        { name: "Jalaz", image: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg" },
        { name: "Narr", image: "https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg" },
        { name: "Carry", image: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg" },
        { name: "Garius", image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg" },
        { name: "Ioya", image: "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg" },
        { name: "Knot", image: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg" },
      ],
    },
    {
      id: 5,
      department: "Diplo",
      lead: { name: "Jalaz", image: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg" },
      members: [
        { name: "HVn", image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg" },
        { name: "Boscat", image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg" },
      ],
    },
    {
      id: 6,
      department: "ROW League",
      lead: { name: "Shiso", image: "/img/shiso.png" },
      members: [
        { name: "Esvipe", image: "/img/esvipe.png" },
      ],
    },
    {
      id: 7,
      department: "Recruitment",
      lead: { name: "Larnak", image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg" },
      members: [
        { name: "Knot", image: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg" },
        { name: "Shiso", image: "/img/shiso.png" },
        { name: "Sushi", image: "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg" },
      ],
    },
    {
      id: 8,
      department: "Planning",
      lead: { name: "Honey Face", image: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg" },
      members: [
        { name: "Blade", image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg" },
      ],
    },
  ];

  const leaders = [
    { name: "Shiso", image: "/img/shiso.png", role: "Founder" },
    { name: "Esvipe", image: "/img/esvipe.png", role: "Co-Leader" },
    { name: "FOB", image: "/img/fob.png", role: "Co-Leader" },
    { name: "Joker", image: "/img/joker.png", role: "Co-Leader" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <IoArrowBack className="text-xl" />
              <span className="text-sm font-semibold">Back</span>
            </button>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-3xl font-zentry font-black text-white tracking-wider">
              TEAM HIERARCHY
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Leaders Section */}
        <section className="mb-20">
          <AnimatedTitle
            title="<b>Leadership</b> Team"
            containerClass="mb-12 !text-white text-center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((leader, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative bg-gradient-to-br from-violet-600/20 to-blue-600/20 rounded-2xl p-6 border-2 border-violet-400/30 hover:border-violet-400 transition-all duration-300 hover:scale-105">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-violet-400 shadow-xl shadow-violet-500/50">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-zentry font-black text-center text-white mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-violet-300 text-center font-semibold text-sm">
                    {leader.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Departments Section */}
        <section>
          <AnimatedTitle
            title="<b>Department</b> Structure"
            containerClass="mb-12 !text-white text-center"
          />

          <div className="space-y-12">
            {hierarchy.map((dept, deptIndex) => (
              <motion.div
                key={dept.id}
                className="bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-8 border-2 border-white/20 hover:border-white/40 transition-all duration-500"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: deptIndex * 0.1 }}
              >
                {/* Department Title */}
                <h2 className="text-3xl font-zentry font-black text-white mb-8 text-center">
                  {dept.department}
                </h2>

                {/* Lead */}
                <div className="flex justify-center mb-8">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-2xl p-6 border-3 border-yellow-400 shadow-2xl shadow-yellow-500/30">
                      <div className="absolute -top-3 -right-3 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">
                        LEAD
                      </div>
                      <div className="w-28 h-28 mx-auto mb-3 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg">
                        <img
                          src={dept.lead.image}
                          alt={dept.lead.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xl font-zentry font-black text-center text-white">
                        {dept.lead.name}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Connecting Line */}
                <div className="w-px h-12 bg-gradient-to-b from-yellow-400 to-white/30 mx-auto mb-8"></div>

                {/* Members */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {dept.members.map((member, memberIndex) => (
                    <motion.div
                      key={memberIndex}
                      className="relative group"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: memberIndex * 0.05 }}
                    >
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-violet-400/50 transition-all duration-300 hover:bg-white/15">
                        <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/30 group-hover:border-violet-400 transition-colors">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-bold text-center text-white">
                          {member.name}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HierarchyTree;
