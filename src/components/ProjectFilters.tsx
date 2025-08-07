import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface ProjectFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    category?: string;
    tags?: string;
    author?: string;
    minRating?: number;
    maxPrice?: number;
    isFree?: boolean;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
}

const categories = [
  { value: 'automotive', label: 'Automotive' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'consumer', label: 'Consumer Products' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'medical', label: 'Medical' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'tools', label: 'Tools & Equipment' },
  { value: 'toys', label: 'Toys & Games' },
];

const sortOptions = [
  { value: 'created_at|desc', label: 'Newest First' },
  { value: 'created_at|asc', label: 'Oldest First' },
  { value: 'rating|desc', label: 'Highest Rated' },
  { value: 'downloads|desc', label: 'Most Downloaded' },
  { value: 'price|asc', label: 'Price: Low to High' },
  { value: 'price|desc', label: 'Price: High to Low' },
  { value: 'title|asc', label: 'Name A-Z' },
];

export const ProjectFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onReset
}: ProjectFiltersProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, filters.maxPrice || 100]);
  const [ratingRange, setRatingRange] = useState([filters.minRating || 0, 5]);

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('|');
    onFiltersChange({ ...filters, sortBy, sortOrder });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      category: value === 'all' ? undefined : value 
    });
  };

  const handleAdvancedFiltersApply = () => {
    onFiltersChange({
      ...filters,
      minRating: ratingRange[0],
      maxPrice: filters.isFree ? undefined : priceRange[1],
    });
    setIsAdvancedOpen(false);
  };

  const handleTagRemove = (tagToRemove: string) => {
    const currentTags = filters.tags ? filters.tags.split(',') : [];
    const newTags = currentTags.filter(tag => tag.trim() !== tagToRemove);
    onFiltersChange({ ...filters, tags: newTags.length > 0 ? newTags.join(',') : undefined });
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder' &&
    value !== undefined && value !== null && value !== ''
  ).length;

  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      {/* Main Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={`${filters.sortBy || 'created_at'}|${filters.sortOrder || 'desc'}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Advanced Filters</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                <div>
                  <Label className="text-sm font-medium">Price Range</Label>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Switch
                        checked={filters.isFree || false}
                        onCheckedChange={(checked) => 
                          onFiltersChange({ ...filters, isFree: checked })
                        }
                      />
                      <Label className="text-sm">Free only</Label>
                    </div>
                    {!filters.isFree && (
                      <div>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={500}
                          min={0}
                          step={5}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>$0</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Minimum Rating</Label>
                  <div className="mt-2">
                    <Slider
                      value={ratingRange}
                      onValueChange={setRatingRange}
                      max={5}
                      min={0}
                      step={0.5}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0 stars</span>
                      <span>{ratingRange[0]} stars</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAdvancedFiltersApply} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={onReset}>
                    Reset
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.tags || filters.category || filters.isFree || filters.minRating) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Category: {categories.find(c => c.value === filters.category)?.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => handleCategoryChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.tags && filters.tags.split(',').map((tag, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {tag.trim()}
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => handleTagRemove(tag.trim())}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {filters.isFree && (
            <Badge variant="secondary" className="gap-1">
              Free only
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => onFiltersChange({ ...filters, isFree: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.minRating && filters.minRating > 0 && (
            <Badge variant="secondary" className="gap-1">
              {filters.minRating}+ stars
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => onFiltersChange({ ...filters, minRating: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};