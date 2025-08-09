import Layout from "@/components/Layout";
import { useState, useEffect, useCallback } from "react";
import { ProjectFilters } from "@/components/ProjectFilters";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectPagination } from "@/components/ProjectPagination";
import { useProjectCRUD, ProjectSearchParams } from "@/hooks/useProjectCRUD";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProjectSearchParams>({
    page: 1,
    limit: 12,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [projectsData, setProjectsData] = useState<any>(null);
  
  const { searchProjects, isLoading } = useProjectCRUD();

  const fetchProjects = useCallback(async () => {
    const searchParams = {
      ...filters,
      search: searchTerm || undefined,
    };
    
    try {
      const data = await searchProjects(searchParams);
      if (data) {
        setProjectsData(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [searchProjects, searchTerm, filters]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleFiltersReset = () => {
    setSearchTerm("");
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  const handleProjectView = (project: any) => {
    // TODO: Navigate to project detail page
    console.log('View project:', project);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Project Library
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover professional-grade 3D models and CAD files from our community
            </p>
            {projectsData && (
              <p className="text-sm text-muted-foreground mt-2">
                {projectsData.totalCount} projects found
              </p>
            )}
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <ProjectFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleFiltersReset}
            />
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: filters.limit || 12 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : projectsData?.projects && projectsData.projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {projectsData.projects.map((project: any) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onView={handleProjectView}
                  />
                ))}
              </div>

              {/* Pagination */}
              <ProjectPagination
                currentPage={projectsData.currentPage}
                totalPages={projectsData.totalPages}
                totalCount={projectsData.totalCount}
                pageSize={filters.limit || 12}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || Object.keys(filters).length > 2
                  ? "Try adjusting your search terms or filters"
                  : "Be the first to upload a project!"
                }
              </p>
              {(searchTerm || Object.keys(filters).length > 2) && (
                <button
                  onClick={handleFiltersReset}
                  className="text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Library;