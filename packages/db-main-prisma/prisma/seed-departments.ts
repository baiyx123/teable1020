import { PrismaClient } from '@prisma/client';
import { generateUserId } from '@teable/core';

const prisma = new PrismaClient();

async function seedDepartments() {
  console.log('开始创建测试部门数据...');

  const adminUserId = generateUserId();

  // 清除现有数据（可选）
  await prisma.department.deleteMany({});

  // 创建一级部门
  const dept001 = await prisma.department.create({
    data: {
      id: 'dept_001',
      name: '总部',
      code: '001',
      level: 1,
      path: '/001/',
      status: 'active',
      createdBy: adminUserId,
      description: '公司总部',
    },
  });

  const dept002 = await prisma.department.create({
    data: {
      id: 'dept_002',
      name: '分公司',
      code: '002',
      level: 1,
      path: '/002/',
      status: 'active',
      createdBy: adminUserId,
      description: '各地分公司',
    },
  });

  // 创建二级部门（总部下）
  await prisma.department.create({
    data: {
      id: 'dept_001001',
      name: '技术部',
      code: '001001',
      parentId: dept001.id,
      level: 2,
      path: '/001/001001/',
      status: 'active',
      createdBy: adminUserId,
      description: '技术研发部门',
    },
  });

  await prisma.department.create({
    data: {
      id: 'dept_001002',
      name: '市场部',
      code: '001002',
      parentId: dept001.id,
      level: 2,
      path: '/001/001002/',
      status: 'active',
      createdBy: adminUserId,
      description: '市场营销部门',
    },
  });

  await prisma.department.create({
    data: {
      id: 'dept_001003',
      name: '人事部',
      code: '001003',
      parentId: dept001.id,
      level: 2,
      path: '/001/001003/',
      status: 'active',
      createdBy: adminUserId,
      description: '人力资源部门',
    },
  });

  await prisma.department.create({
    data: {
      id: 'dept_001004',
      name: '财务部',
      code: '001004',
      parentId: dept001.id,
      level: 2,
      path: '/001/001004/',
      status: 'active',
      createdBy: adminUserId,
      description: '财务管理部门',
    },
  });

  // 创建三级部门（技术部下）
  await prisma.department.create({
    data: {
      id: 'dept_001001001',
      name: '前端组',
      code: '001001001',
      parentId: 'dept_001001',
      level: 3,
      path: '/001/001001/001001001/',
      status: 'active',
      createdBy: adminUserId,
      description: '前端开发组',
    },
  });

  await prisma.department.create({
    data: {
      id: 'dept_001001002',
      name: '后端组',
      code: '001001002',
      parentId: 'dept_001001',
      level: 3,
      path: '/001/001001/001001002/',
      status: 'active',
      createdBy: adminUserId,
      description: '后端开发组',
    },
  });

  await prisma.department.create({
    data: {
      id: 'dept_001001003',
      name: '测试组',
      code: '001001003',
      parentId: 'dept_001001',
      level: 3,
      path: '/001/001001/001001003/',
      status: 'active',
      createdBy: adminUserId,
      description: '质量保证组',
    },
  });

  // 创建二级部门（分公司下）
  await prisma.department.create({
    data: {
      id: 'dept_002001',
      name: '华东分公司',
      code: '002001',
      parentId: dept002.id,
      level: 2,
      path: '/002/002001/',
      status: 'active',
      createdBy: adminUserId,
      description: '华东区域分公司',
    },
  });

  await prisma.department.create({
    data: {
      id: 'dept_002002',
      name: '华南分公司',
      code: '002002',
      parentId: dept002.id,
      level: 2,
      path: '/002/002002/',
      status: 'active',
      createdBy: adminUserId,
      description: '华南区域分公司',
    },
  });

  console.log('测试部门数据创建成功！');
  console.log('已创建部门：');
  console.log('  001 - 总部');
  console.log('    001001 - 技术部');
  console.log('      001001001 - 前端组');
  console.log('      001001002 - 后端组');
  console.log('      001001003 - 测试组');
  console.log('    001002 - 市场部');
  console.log('    001003 - 人事部');
  console.log('    001004 - 财务部');
  console.log('  002 - 分公司');
  console.log('    002001 - 华东分公司');
  console.log('    002002 - 华南分公司');
}

seedDepartments()
  .catch((e) => {
    console.error('创建测试数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

