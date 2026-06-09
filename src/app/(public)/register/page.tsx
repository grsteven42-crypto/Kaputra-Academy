import prisma from "@/lib/db";
import { submitRegistration } from "@/actions/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = {
  title: "Register | Kaputra Academy",
};

export default async function RegisterPage() {
  // Ensure we have at least one course for demonstration purposes
  let courses = await prisma.course.findMany({
    where: { isPublished: true },
  });

  if (courses.length === 0) {
    // Seed a dummy category and course if none exist
    const category = await prisma.category.upsert({
      where: { slug: "tech" },
      update: {},
      create: { name: "Technology", slug: "tech", description: "Tech courses" },
    });

    await prisma.course.upsert({
      where: { slug: "full-stack-web" },
      update: {},
      create: {
        title: "Full Stack Web Development",
        slug: "full-stack-web",
        shortDescription: "Learn to build modern web applications.",
        fullDescription: "Complete full stack course.",
        objectives: "Master React and Node.js",
        learningOutcomes: "Build 5 real world apps",
        schedule: "Mon-Wed-Fri",
        price: 5000000,
        registrationFee: 250000,
        categoryId: category.id,
        isPublished: true,
      },
    });

    courses = await prisma.course.findMany({
      where: { isPublished: true },
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#072147]">
            Academy Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please fill out the details below to enroll.
          </p>
        </div>

        <form action={submitRegistration} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold text-[#072147] mb-4">
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Full Name</Label>
                <Input
                  id="studentName"
                  name="studentName"
                  required
                  placeholder="John Doe"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentAge">Age</Label>
                <Input
                  id="studentAge"
                  name="studentAge"
                  type="number"
                  required
                  placeholder="18"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold text-[#072147] mb-4">
              Parent/Guardian Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="parentName">Parent Name</Label>
                <Input
                  id="parentName"
                  name="parentName"
                  required
                  placeholder="Jane Doe"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">Phone Number</Label>
                <Input
                  id="parentPhone"
                  name="parentPhone"
                  required
                  placeholder="+62 812..."
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentEmail">Email Address</Label>
                <Input
                  id="parentEmail"
                  name="parentEmail"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold text-[#072147] mb-4">
              Program Selection
            </h3>
            <div className="space-y-2">
              <Label htmlFor="courseId">Selected Program</Label>
              <select
                id="courseId"
                name="courseId"
                required
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled selected>
                  Select a program...
                </option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} - Rp {course.price.toLocaleString("id-ID")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-bold py-3 rounded-xl shadow-lg transition-all text-lg"
          >
            Submit Registration
          </Button>
        </form>
      </div>
    </main>
  );
}
