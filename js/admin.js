import { auth, db, storage } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {
    ref,
    uploadBytes,
    getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        showDashboard();
    } else {
        showLogin();
    }
});

// Login functionality
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('loginError');
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            errorMsg.textContent = '';
        } catch (error) {
            errorMsg.textContent = 'Invalid email or password';
            console.error('Login error:', error);
        }
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}

// Show/hide screens
function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadAllData();
}

// Menu navigation
const menuItems = document.querySelectorAll('.admin-menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        
        menuItems.forEach(mi => mi.classList.remove('active'));
        item.classList.add('active');
        
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}Section`).classList.add('active');
    });
});

// Load all data
async function loadAllData() {
    loadProjects();
    loadDesigners();
    loadReviews();
}

// ========== PROJECTS ==========
let editingProjectId = null;

async function loadProjects() {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList) return;
    
    try {
        const snapshot = await getDocs(collection(db, 'projects'));
        projectsList.innerHTML = '';
        
        if (snapshot.empty) {
            projectsList.innerHTML = '<p class="loading">No projects yet. Click "Add New Project" to get started.</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const project = { id: doc.id, ...doc.data() };
            const projectItem = createProjectItem(project);
            projectsList.appendChild(projectItem);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsList.innerHTML = '<p class="loading">Error loading projects.</p>';
    }
}

function createProjectItem(project) {
    const item = document.createElement('div');
    item.className = 'admin-item';
    item.innerHTML = `
        <div class="admin-item-info">
            <h3>${project.title}</h3>
            <p>${project.category || 'Uncategorized'} ${project.featured ? '• Featured' : ''}</p>
        </div>
        <div class="admin-item-actions">
            <button class="btn-edit" onclick="editProject('${project.id}')">Edit</button>
            <button class="btn-delete" onclick="deleteProject('${project.id}')">Delete</button>
        </div>
    `;
    return item;
}

// Make functions global for onclick handlers
window.editProject = async function(projectId) {
    editingProjectId = projectId;
    const projectDoc = await getDoc(doc(db, 'projects', projectId));
    const project = { id: projectDoc.id, ...projectDoc.data() };
    
    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    document.getElementById('projectTitle').value = project.title || '';
    document.getElementById('projectDescription').value = project.description || '';
    document.getElementById('projectCategory').value = project.category || 'residential';
    document.getElementById('projectFeatured').checked = project.featured || false;
    
    // Show existing images
    const preview = document.getElementById('projectImagesPreview');
    preview.innerHTML = '';
    if (project.images && project.images.length > 0) {
        project.images.forEach(img => {
            const imgEl = document.createElement('img');
            imgEl.src = img;
            preview.appendChild(imgEl);
        });
    }
    
    document.getElementById('projectModal').style.display = 'block';
};

window.deleteProject = async function(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            await deleteDoc(doc(db, 'projects', projectId));
            loadProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error deleting project');
        }
    }
};

// Add/Edit Project
const addProjectBtn = document.getElementById('addProjectBtn');
if (addProjectBtn) {
    addProjectBtn.addEventListener('click', () => {
        editingProjectId = null;
        document.getElementById('projectModalTitle').textContent = 'Add New Project';
        document.getElementById('projectForm').reset();
        document.getElementById('projectImagesPreview').innerHTML = '';
        document.getElementById('projectModal').style.display = 'block';
    });
}

const projectForm = document.getElementById('projectForm');
if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('projectTitle').value;
        const description = document.getElementById('projectDescription').value;
        const category = document.getElementById('projectCategory').value;
        const featured = document.getElementById('projectFeatured').checked;
        const imageFiles = document.getElementById('projectImages').files;
        
        try {
            // Upload images
            const imageUrls = [];
            if (imageFiles.length > 0) {
                for (let file of imageFiles) {
                    const imageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
                    await uploadBytes(imageRef, file);
                    const url = await getDownloadURL(imageRef);
                    imageUrls.push(url);
                }
            }
            
            // Get existing images if editing
            let existingImages = [];
            if (editingProjectId) {
                const projectDoc = await getDoc(doc(db, 'projects', editingProjectId));
                existingImages = projectDoc.data().images || [];
            }
            
            const projectData = {
                title,
                description,
                category,
                featured,
                images: [...existingImages, ...imageUrls],
                date: editingProjectId ? undefined : serverTimestamp()
            };
            
            if (editingProjectId) {
                await updateDoc(doc(db, 'projects', editingProjectId), projectData);
            } else {
                await addDoc(collection(db, 'projects'), projectData);
            }
            
            document.getElementById('projectModal').style.display = 'none';
            projectForm.reset();
            loadProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project');
        }
    });
}

// ========== DESIGNERS ==========
let editingDesignerId = null;

async function loadDesigners() {
    const designersList = document.getElementById('designersList');
    if (!designersList) return;
    
    try {
        const snapshot = await getDocs(collection(db, 'designers'));
        designersList.innerHTML = '';
        
        if (snapshot.empty) {
            designersList.innerHTML = '<p class="loading">No designers yet. Click "Add New Designer" to get started.</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const designer = { id: doc.id, ...doc.data() };
            const designerItem = createDesignerItem(designer);
            designersList.appendChild(designerItem);
        });
    } catch (error) {
        console.error('Error loading designers:', error);
        designersList.innerHTML = '<p class="loading">Error loading designers.</p>';
    }
}

function createDesignerItem(designer) {
    const item = document.createElement('div');
    item.className = 'admin-item';
    item.innerHTML = `
        <div class="admin-item-info">
            <h3>${designer.name}</h3>
            <p>${designer.role || 'Designer'}</p>
        </div>
        <div class="admin-item-actions">
            <button class="btn-edit" onclick="editDesigner('${designer.id}')">Edit</button>
            <button class="btn-delete" onclick="deleteDesigner('${designer.id}')">Delete</button>
        </div>
    `;
    return item;
}

window.editDesigner = async function(designerId) {
    editingDesignerId = designerId;
    const designerDoc = await getDoc(doc(db, 'designers', designerId));
    const designer = { id: designerDoc.id, ...designerDoc.data() };
    
    document.getElementById('designerModalTitle').textContent = 'Edit Designer';
    document.getElementById('designerName').value = designer.name || '';
    document.getElementById('designerRole').value = designer.role || '';
    document.getElementById('designerBio').value = designer.bio || '';
    document.getElementById('designerExperience').value = designer.experience || '';
    document.getElementById('designerSpecialties').value = designer.specialties ? designer.specialties.join(', ') : '';
    
    const preview = document.getElementById('designerImagePreview');
    preview.innerHTML = '';
    if (designer.image) {
        const imgEl = document.createElement('img');
        imgEl.src = designer.image;
        preview.appendChild(imgEl);
    }
    
    document.getElementById('designerModal').style.display = 'block';
};

window.deleteDesigner = async function(designerId) {
    if (confirm('Are you sure you want to delete this designer?')) {
        try {
            await deleteDoc(doc(db, 'designers', designerId));
            loadDesigners();
        } catch (error) {
            console.error('Error deleting designer:', error);
            alert('Error deleting designer');
        }
    }
};

const addDesignerBtn = document.getElementById('addDesignerBtn');
if (addDesignerBtn) {
    addDesignerBtn.addEventListener('click', () => {
        editingDesignerId = null;
        document.getElementById('designerModalTitle').textContent = 'Add New Designer';
        document.getElementById('designerForm').reset();
        document.getElementById('designerImagePreview').innerHTML = '';
        document.getElementById('designerModal').style.display = 'block';
    });
}

const designerForm = document.getElementById('designerForm');
if (designerForm) {
    designerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('designerName').value;
        const role = document.getElementById('designerRole').value;
        const bio = document.getElementById('designerBio').value;
        const experience = parseInt(document.getElementById('designerExperience').value) || 0;
        const specialties = document.getElementById('designerSpecialties').value
            .split(',')
            .map(s => s.trim())
            .filter(s => s);
        const imageFile = document.getElementById('designerImage').files[0];
        
        try {
            let imageUrl = '';
            
            // Get existing image if editing
            if (editingDesignerId && !imageFile) {
                const designerDoc = await getDoc(doc(db, 'designers', editingDesignerId));
                imageUrl = designerDoc.data().image || '';
            }
            
            // Upload new image if provided
            if (imageFile) {
                const imageRef = ref(storage, `designers/${Date.now()}_${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(imageRef);
            }
            
            const designerData = {
                name,
                role,
                bio,
                experience,
                specialties,
                image: imageUrl
            };
            
            if (editingDesignerId) {
                await updateDoc(doc(db, 'designers', editingDesignerId), designerData);
            } else {
                await addDoc(collection(db, 'designers'), designerData);
            }
            
            document.getElementById('designerModal').style.display = 'none';
            designerForm.reset();
            loadDesigners();
        } catch (error) {
            console.error('Error saving designer:', error);
            alert('Error saving designer');
        }
    });
}

// ========== REVIEWS ==========
let editingReviewId = null;

async function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    try {
        const snapshot = await getDocs(collection(db, 'reviews'));
        reviewsList.innerHTML = '';
        
        if (snapshot.empty) {
            reviewsList.innerHTML = '<p class="loading">No reviews yet. Click "Add New Review" to get started.</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const review = { id: doc.id, ...doc.data() };
            const reviewItem = createReviewItem(review);
            reviewsList.appendChild(reviewItem);
        });
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsList.innerHTML = '<p class="loading">Error loading reviews.</p>';
    }
}

function createReviewItem(review) {
    const date = review.date ? new Date(review.date.seconds * 1000).toLocaleDateString() : 'No date';
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    const item = document.createElement('div');
    item.className = 'admin-item';
    item.innerHTML = `
        <div class="admin-item-info">
            <h3>${review.clientName}</h3>
            <p>${review.project || 'No project'} • ${stars} ${review.approved ? '• Approved' : '• Pending'}</p>
        </div>
        <div class="admin-item-actions">
            <button class="btn-edit" onclick="editReview('${review.id}')">Edit</button>
            <button class="btn-delete" onclick="deleteReview('${review.id}')">Delete</button>
        </div>
    `;
    return item;
}

window.editReview = async function(reviewId) {
    editingReviewId = reviewId;
    const reviewDoc = await getDoc(doc(db, 'reviews', reviewId));
    const review = { id: reviewDoc.id, ...reviewDoc.data() };
    
    document.getElementById('reviewModalTitle').textContent = 'Edit Review';
    document.getElementById('reviewClientName').value = review.clientName || '';
    document.getElementById('reviewProject').value = review.project || '';
    document.getElementById('reviewRating').value = review.rating || 5;
    document.getElementById('reviewComment').value = review.comment || '';
    document.getElementById('reviewApproved').checked = review.approved !== false;
    
    document.getElementById('reviewModal').style.display = 'block';
};

window.deleteReview = async function(reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        try {
            await deleteDoc(doc(db, 'reviews', reviewId));
            loadReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Error deleting review');
        }
    }
};

const addReviewBtn = document.getElementById('addReviewBtn');
if (addReviewBtn) {
    addReviewBtn.addEventListener('click', () => {
        editingReviewId = null;
        document.getElementById('reviewModalTitle').textContent = 'Add New Review';
        document.getElementById('reviewForm').reset();
        document.getElementById('reviewApproved').checked = true;
        document.getElementById('reviewModal').style.display = 'block';
    });
}

const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const clientName = document.getElementById('reviewClientName').value;
        const project = document.getElementById('reviewProject').value;
        const rating = parseInt(document.getElementById('reviewRating').value);
        const comment = document.getElementById('reviewComment').value;
        const approved = document.getElementById('reviewApproved').checked;
        
        try {
            const reviewData = {
                clientName,
                project,
                rating,
                comment,
                approved,
                date: editingReviewId ? undefined : serverTimestamp()
            };
            
            if (editingReviewId) {
                await updateDoc(doc(db, 'reviews', editingReviewId), reviewData);
            } else {
                await addDoc(collection(db, 'reviews'), reviewData);
            }
            
            document.getElementById('reviewModal').style.display = 'none';
            reviewForm.reset();
            loadReviews();
        } catch (error) {
            console.error('Error saving review:', error);
            alert('Error saving review');
        }
    });
}

// Close modals
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-modal') || e.target.classList.contains('admin-modal')) {
        const modals = document.querySelectorAll('.admin-modal');
        modals.forEach(modal => {
            if (modal === e.target || e.target.classList.contains('close-modal')) {
                modal.style.display = 'none';
            }
        });
    }
});

// Image preview for file inputs
document.getElementById('projectImages')?.addEventListener('change', function(e) {
    const preview = document.getElementById('projectImagesPreview');
    preview.innerHTML = '';
    Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});

document.getElementById('designerImage')?.addEventListener('change', function(e) {
    const preview = document.getElementById('designerImagePreview');
    preview.innerHTML = '';
    if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});
