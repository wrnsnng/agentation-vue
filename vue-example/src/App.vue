<script setup lang="ts">
import { Agentation } from "agentation/vue";
</script>

<template>
  <div id="page">
    <Agentation />

    <header>
      <h1>Agentation Vue 3 Test</h1>
      <p>Click elements on this page to annotate them. Use the floating toolbar to manage annotations.</p>
    </header>

    <main>
      <section class="card">
        <h2>Feature Card</h2>
        <p>This is a sample card component. Try clicking it to create an annotation.</p>
        <button class="btn primary">Primary Action</button>
        <button class="btn secondary">Secondary Action</button>
      </section>

      <section class="card">
        <h2>Navigation Example</h2>
        <nav>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Contact</a>
        </nav>
      </section>

      <section class="card">
        <h2>Form Elements</h2>
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" type="text" placeholder="Enter your name" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" rows="3" placeholder="Write something..."></textarea>
        </div>
        <button class="btn primary">Submit</button>
      </section>

      <section class="card">
        <h2>Content Block</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris.
        </p>
        <ul>
          <li>First list item</li>
          <li>Second list item</li>
          <li>Third list item with <strong>bold text</strong></li>
        </ul>
      </section>

      <section class="grid">
        <div class="grid-item" v-for="i in 6" :key="i">
          <div class="grid-icon">{{ ['📦', '🎨', '⚡', '🔧', '📊', '🚀'][i - 1] }}</div>
          <h3>Item {{ i }}</h3>
          <p>Grid item description</p>
        </div>
      </section>
    </main>

    <footer>
      <p>Agentation Vue 3 Test App</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  color: #1a1a1a;
  line-height: 1.6;
}

#page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

header {
  margin-bottom: 2rem;
}

header h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

header p {
  color: #666;
}

main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.card h2 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
}

.card p {
  color: #444;
  margin-bottom: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  margin-right: 0.5rem;
}

.btn.primary {
  background: #3c82f7;
  color: white;
}

.btn.secondary {
  background: #e5e7eb;
  color: #374151;
}

nav {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

nav a {
  color: #3c82f7;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

nav a:hover {
  background: #eff6ff;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
}

ul {
  padding-left: 1.5rem;
}

ul li {
  margin-bottom: 0.25rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.grid-item {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.grid-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.grid-item h3 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.grid-item p {
  font-size: 0.8rem;
  color: #666;
}

footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  color: #999;
  font-size: 0.875rem;
}
</style>
